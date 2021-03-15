import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { Listener } from 'discord-akairo';
import { MessageEmbed, VoiceState } from 'discord.js';
import { MyClient } from '../client';
import { nonNullable } from '../util';

dayjs.locale('ja');

export default class VoiceStateUpdateListener extends Listener {
	constructor() {
		super('voiceStateUpdate', {
			emitter: 'client',
			event: 'voiceStateUpdate',
		});
	}

	async exec(oldState: VoiceState, newState: VoiceState) {
		if (!(oldState.client instanceof MyClient) || !(newState.client instanceof MyClient))
			return;

		const client = oldState.client;
		const guild = oldState.guild;
		const guildConfig = await client.config.get(guild.id);
		if (!guildConfig.notifyChannelId) return;

		const notifyChannel = oldState.client.channels.resolve(guildConfig.notifyChannelId);
		if (!notifyChannel?.isText()) return;

		// 通話開始
		(async () => {
			if (
				newState.channel &&
				newState.channelID &&
				newState.member &&
				oldState.channelID !== newState.channelID && // 変化前と変化後のチャンネルが異なる
				newState.channelID !== newState.guild.afkChannelID && // AFK 隔離部屋でない
				newState.channel?.members.size === 1 // 変化後のチャンネルにいるメンバーが1人
			) {
				const channel = newState.channel;
				const channelConfig = guildConfig.voiceChannels.get(channel.id);
				if (!channelConfig) return;

				const member = newState.member;

				// 該当ユーザーのメンション
				const mention = (() => {
					const roles = channelConfig.roles.map((v) => guild.roles.resolve(v));
					const members = channelConfig.users.map((v) => guild.members.resolve(v));
					return [...roles, ...members].filter(nonNullable).join(' ');
				})();

				const content = `${mention} ${member.displayName}が${channel.name}で通話を開始しました！`;
				const embed = new MessageEmbed()
					.setTitle(`${channel.name}で通話中です`)
					.setAuthor(
						`${member.displayName} (${member.user.tag})`,
						member.user.displayAvatarURL()
					)
					.setColor('GREEN')
					.addField('通話開始', dayjs().format('YYYY/MM/DD HH:mm:ss'))
					.setFooter(
						`${guild.me?.displayName} (${client.user?.tag})`,
						client.user?.displayAvatarURL()
					)
					.setTimestamp();
				const sentMessage = await notifyChannel.send(content, embed);

				guildConfig.voiceChannels.set(channel.id, {
					...channelConfig,
					messageId: sentMessage.id,
				});
				client.config.set(guild.id, guildConfig);
			}
		})();

		// 通話終了
		(async () => {
			if (
				oldState.channelID &&
				oldState.channel &&
				oldState.channelID !== newState.channelID && // 変化前と変化後のチャンネルが異なる
				oldState.channel?.members.size === 0 // 変化前のチャンネルにいるメンバーが0人
			) {
				const channel = oldState.channel;
				const channelConfig = guildConfig.voiceChannels.get(channel.id);
				if (!channelConfig?.messageId) return;

				const message = notifyChannel.messages.resolve(channelConfig.messageId);
				if (!message) return;

				const embed = message.embeds[0]
					.setTitle(`${channel.name}の通話は終了しました`)
					.setColor('DARK_GREY')
					.addField('通話終了', dayjs().format('YYYY/MM/DD HH:mm:ss'))
					.setTimestamp();
				message.edit('', embed);
			}
		})();
	}
}
