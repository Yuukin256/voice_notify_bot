import { Command } from 'discord-akairo';
import Discord from 'discord.js';
import { Collection } from 'discord.js';
import { MyClient } from '../client';

// TODO: Fix

interface Args {
	channels: Collection<string, Discord.VoiceChannel>;
}

export default class RemoveNotifyMentionDataCommand extends Command {
	constructor() {
		super('removeNotifyMentionData', {
			aliases: ['remove', 'r'],
			channel: 'guild',
			description: '通話開始時のメンション設定を削除する',
			args: [
				{
					id: 'channels',
					type: 'voiceChannels',
					prompt: {
						start: 'メンション設定を削除したいボイスチャンネルのIDを入力してください',
					},
					default: new Collection(),
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
		const config = this.client.config;
		const guildConfig = await config.get(guild.id);

		const contents = args.channels.map((channel) => {
			const deleted = guildConfig.voiceChannels.delete(channel.id);

			config.set(guild.id, {
				...guildConfig,
			});

			return deleted
				? `${channel.name}の設定を削除しました`
				: `${channel.name}の設定を削除できませんでした (未設定かも)`;
		});

		return message.util.reply(contents.join('\n'));
	}
}
