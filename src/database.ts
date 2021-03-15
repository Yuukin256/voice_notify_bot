import { Collection } from 'discord.js';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';
import path from 'path';

export interface voiceChannelConfig {
	id: string;
	roles: string[];
	users: string[];
	messageId: string | null;
}

export interface GuildConfig {
	id: string;
	prefix: string;
	notifyChannelId: string | null;
	voiceChannels: Collection<string, voiceChannelConfig>;
}

class Config extends Keyv<GuildConfig> {
	constructor() {
		super({
			store: new KeyvFile({
				filename: path.join(__dirname, 'config.json'),
			}),
		});
	}

	async get(key: string): Promise<GuildConfig> {
		const value = await super.get(key);
		if (!value) {
			const defaultValue = {
				id: key,
				prefix: '))',
				notifyChannelId: null,
				voiceChannels: new Collection<string, voiceChannelConfig>(),
			};
			this.set(key, defaultValue);
			return defaultValue;
		}

		return {
			...value,
			voiceChannels: new Collection(value?.voiceChannels.map((v) => [v.id, v])),
		};
	}
}

export const config = new Config();
