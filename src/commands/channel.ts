import { Command } from 'discord-akairo';
import Discord from 'discord.js';
import { MyClient } from '../client';

// TODO: Fix

interface Args {
	channel: Discord.TextChannel | null;
}

export default class GetSetNotifyChannelCommand extends Command {
	constructor() {
		super('get/setNotifyChannel', {
			aliases: ['channel', 'ch'],
			channel: 'guild',
			description: '通話開始時に通知を行うチャンネルを確認/設定する',
      userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					id: 'channel',
					type: 'textChannel',
				},
			],
		});
	}

	async exec(message: Discord.Message, args: Args) {
		if (!message.guild) return;

		if (!(this.client instanceof MyClient) || !message.util) {
			return message.channel.send('Bot内部でエラーが発生しました');
		}

		const guild = message.guild;
		const guildConfig = await this.client.config.get(guild.id);

		if (args.channel) {
			const newChannel = args.channel;
			this.client.config.set(guild.id, {
				...guildConfig,
				notifyChannelId: newChannel.id,
			});
			return message.util.reply(`通話開始お知らせチャンネルを ${newChannel} に設定しました`);
		}

		const channel = guild.channels.resolve(guildConfig.notifyChannelId ?? '');
		if (channel) {
			return message.util.reply(
				`現在、通話開始お知らせチャンネルに設定されているのは ${channel} です`
			);
		} else {
			this.client.config.set(guild.id, {
				...guildConfig,
				notifyChannelId: null,
			});
			return message.util.reply(`現在、通話開始お知らせチャンネルは設定されていません`);
		}
	}
}
