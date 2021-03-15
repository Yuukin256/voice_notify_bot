import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import { MyClient } from '../client';
import { updatePrefixDisplay } from '../util';

interface Args {
	prefix: string | null;
}

export default class PrefixCommand extends Command {
	constructor() {
		super('getPrefix/setPrefix', {
			aliases: ['prefix'],
			channel: 'guild',
			description: 'BotのPrefixを取得/変更する',
			userPermissions: ['MANAGE_GUILD'],
			args: [{ id: 'prefix', type: 'string' }],
		});
	}

	async exec(message: Message, args: Args) {
		if (!message.guild) return;

		if (!(this.client instanceof MyClient) || !message.util || !message.guild.me) {
			return message.channel.send('Bot内部でエラーが発生しました');
		}

		const guildConfig = await this.client.config.get(message.guild.id);
		if (args.prefix) {
			this.client.config.set(message.guild.id, { ...guildConfig, prefix: args.prefix });
			updatePrefixDisplay(message.guild.me, args.prefix);
			return message.util.reply(
				`新しいコマンドプレフィックスを \`${args.prefix}\` に設定しました`
			);
		}

		const prefix = guildConfig.prefix;
		return message.util.reply(`現在のコマンドプレフィックスは \`${prefix}\` です`);
	}
}
