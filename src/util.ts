import dayjs from 'dayjs';
import Discord from 'discord.js';

export const nonNullable = <T>(value: T): value is NonNullable<T> => value != null;

export const makeMentionSettingEmbed = (
	chName: string,
	guild: Discord.Guild,
	roles: string[],
	users: string[]
): Discord.EmbedFieldData => {
	const roleMentions = roles.map((roleId) => guild.roles.resolve(roleId));
	const userMentions = users.map((userId) => guild.members.resolve(userId));
	const mentions = [...roleMentions, ...userMentions].filter(nonNullable);
	return {
		name: chName,
		value: mentions.length ? mentions.join(' ') : 'メンションなし',
	};
};

export const timeoutDelete = (
	message: Discord.Message,
	deleteTimeout: number
): Promise<Discord.Message> => {
	const deleteAt = dayjs(message.createdAt).add(deleteTimeout, 'millisecond');
	const millisecondsToWait = deleteAt.diff(dayjs());
	return message.delete({ timeout: millisecondsToWait });
};

export const updatePrefixDisplay = async (me: Discord.GuildMember, prefix: string) => {
	const nowName = me.displayName;
	const re = nowName.match(/^\[.+\]/);
	if (re) {
		const newName = nowName.replace(re[0], `[${prefix}]`);
		return me.setNickname(newName);
	}
	return me.setNickname(`[${prefix}] ${nowName}`);
};
