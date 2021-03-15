import { Listener } from 'discord-akairo';
import { MyClient } from '../client';
import { updatePrefixDisplay } from '../util';

export default class VoiceStateUpdateListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			type: 'once',
		});
	}

	async exec() {
		this.client.guilds.cache.forEach(async (guild) => {
			if (this.client instanceof MyClient) {
				const config = await this.client.config.get(guild.id);
				if (!guild?.me) return;

				// prefix に合わせてニックネームを変更
				updatePrefixDisplay(guild.me, config.prefix);
			}
		});
	}
}
