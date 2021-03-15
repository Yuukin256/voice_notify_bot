import { Command } from 'discord-akairo';
import { DMChannel, Message } from 'discord.js';
import { MyClient } from '../client';

export default class CleanChannelCommand extends Command {
	constructor() {
		super('cleanChannel', {
			aliases: ['clean'],
			args: [{ id: 'deleteSize', index: 0, default: 100, type: 'number', limit: 1 }],
			channel: 'guild',
			userPermissions: ['MANAGE_MESSAGES'],
			clientPermissions: ['MANAGE_MESSAGES'],
			description: '送信されたチャンネルの全メッセージを削除する',
		});
	}

	async exec(message: Message, args: { deleteSize: number }) {
		if (message.channel instanceof DMChannel) return;

		if (!(this.client instanceof MyClient) || !message.util) {
			return message.channel.send('Bot内部でエラーが発生しました');
		}

		const deleted = await message.channel.bulkDelete(args.deleteSize);
		const content = `${deleted.size}件のメッセージを削除しました`;
		const res = message.util
			.reply(content)
			.then((res) => res.delete({ timeout: 1000 * 30 }))
			.catch(); // 30秒後に削除
		return res;
	}
}
