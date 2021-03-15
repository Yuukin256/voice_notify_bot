import { Command } from 'discord-akairo';
import Discord, { Message } from 'discord.js';
import { EmbedFieldData } from 'discord.js';
import { Collection } from 'discord.js';
import { MyClient } from '../client';
import { makeMentionSettingEmbed, nonNullable } from '../util';

interface Args {
	channels: Collection<Discord.Snowflake, Discord.VoiceChannel>;
}

export default class GetNotifyMentionDataCommand extends Command {
	constructor() {
		super('getNotifyMentionData', {
			aliases: ['get', 'g'],
			channel: 'guild',
			description: 'ボイスチャンネルごとに設定した通話開始通知メッセージのメンション先を返す',
			args: [
				{
					id: 'channels',
					default: new Collection(),
					type: 'voiceChannels',
				},
			],
		});
	}

	async exec(message: Message, args: Args) {
		if (!message.guild) return;

		if (!(this.client instanceof MyClient) || !message.util) {
			return message.channel.send('Bot内部でエラーが発生しました');
		}

		const guild = message.guild;
		const guildConfig = await this.client.config.get(guild.id);

		const voiceChannels = args.channels.size
			? args.channels.array()
			: guildConfig.voiceChannels
					.map((val) => guild.channels.resolve(val.id))
					.filter(nonNullable);

		const embedFields = voiceChannels.map<EmbedFieldData>((ch) => {
			const voiceChannelConfig = guildConfig.voiceChannels.get(ch.id);
			if (!voiceChannelConfig) return { name: ch.name, value: 'メンションなし' };
			return makeMentionSettingEmbed(
				ch.name,
				guild,
				voiceChannelConfig.roles,
				voiceChannelConfig.users
			);
		});
		const embed = new Discord.MessageEmbed()
			.setTitle('設定を取得しました')
			.addFields(embedFields)
			.setColor('BLURPLE');
		return message.util.reply(embed);
	}
}
