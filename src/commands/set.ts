import { Command } from 'discord-akairo';
import Discord, { Collection } from 'discord.js';
import { MyClient } from '../client';
import { makeMentionSettingEmbed } from '../util';

interface Args {
	channel: Discord.VoiceChannel | false;
	members: Collection<Discord.Snowflake, Discord.GuildMember>;
	roles: Collection<Discord.Snowflake, Discord.Role>;
}

export default class SetNotifyMentionDataCommand extends Command {
	constructor() {
		super('setNotifyMentionData', {
			aliases: ['set', 's'],
			channel: 'guild',
			description: '通話開始時にメンションで通知するユーザー/ロールを設定する',
			args: [
				{
					id: 'channel',
					type: 'voiceChannel',
					limit: 1,
					index: 0,
					default: false,
				},
				{ id: 'members', type: 'members', unordered: true, default: new Collection() },
				{ id: 'roles', type: 'roles', unordered: true, default: new Collection() },
			],
		});
	}

	async exec(message: Discord.Message, args: Args) {
		if (!message.guild) return;
		const guild = message.guild;

		if (!(this.client instanceof MyClient) || !message.util) {
			return message.channel.send('Bot内部でエラーが発生しました');
		}

		if (!args.channel) {
			return message.util.reply('通知設定を行いたいチャンネルを正しく入力してください');
		}

		if (args.channel.id === guild.afkChannelID) {
			return message.util.reply('AFKチャンネルに通知設定を行うことはできません');
		}

		const guildConfig = await this.client.config.get(guild.id);
		const voiceChannels = guildConfig?.voiceChannels;

		const roleIds = args.roles.map((role) => role.id);
		const memberIds = args.members.map((member) => member.id);

		const voiceChannelConfig = voiceChannels.get(args.channel.id) ?? {
			id: args.channel.id,
			roles: [],
			users: [],
		};
		voiceChannels.set(args.channel.id, {
			...voiceChannelConfig,
			roles: roleIds,
			users: memberIds,
			messageId: null,
		});

		this.client.config.set(guild.id, {
			...guildConfig,
			voiceChannels,
		});

		const embedField = makeMentionSettingEmbed(args.channel.name, guild, roleIds, memberIds);

		const embed = new Discord.MessageEmbed()
			.setTitle('設定を変更しました')
			.addFields(embedField)
			.setColor('BLURPLE');
		return message.util.reply(embed);
	}
}
