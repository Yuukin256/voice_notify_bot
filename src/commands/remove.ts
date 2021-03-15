import { Command } from 'discord-akairo';
import Discord from 'discord.js';
import { MyClient } from '../client';

// TODO: Fix

interface Args {
	channel: Discord.VoiceChannel;
}

export default class RemoveNotifyMentionDataCommand extends Command {
	constructor() {
		super('removeNotifyMentionData', {
			aliases: ['remove', 'r'],
			channel: 'guild',
			description: '通話開始時のメンション設定を削除する',
			args: [
				{
					id: 'channel',
					type: 'voiceChannel',
					limit: 1,
					prompt: {
						start: 'メンション設定を削除したいボイスチャンネルのIDを入力してください',
					},
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

		const deleted = guildConfig.voiceChannels.delete(args.channel.id);

		await this.client.config.set(guild.id, {
			...guildConfig,
		});

		const content = deleted
			? `${args.channel.name}の設定を削除しました`
			: `${args.channel.name}の設定を削除できませんでした (未設定かも)`;
		return message.util.reply(content);
	}
}
