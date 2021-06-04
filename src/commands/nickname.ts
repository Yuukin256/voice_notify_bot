import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

interface Args {
	nickname: string | null;
}

export default class GetPingCommand extends Command {
	constructor() {
		super('setNickname', {
			aliases: ['nick', 'nickname'],
			channel: 'guild',
			description: 'Botのニックネームを変更する',
			userPermissions: ['MANAGE_GUILD'],
			args: [{ id: 'nickname', type: 'string' }],
		});
	}

	exec(message: Message, args: Args) {
		if (!message.guild?.me || !message.util) {
			return message.channel.send('Bot内部でエラーが発生しました');
		}

		if (args.nickname) {
			message.guild.me.setNickname(args.nickname);
			const content = `Botのニックネームを \`${args.nickname}\` に設定しました`;
			return message.util.reply(content);
		} else if (!this.client.user?.username) {
			return message.channel.send('Bot内部でエラーが発生しました');
		} else {
			message.guild.me.setNickname(this.client.user.username);
			const content = `Botのニックネームを \`${this.client.user.username}\` に設定しました`;
			return message.util.reply(content);
		}
	}
}
