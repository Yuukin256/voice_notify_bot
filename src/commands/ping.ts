import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class GetPingCommand extends Command {
	constructor() {
		super('getPingValue', {
			aliases: ['ping'],
			description: '現在のBotのping値を調べる',
		});
	}

	exec(message: Message) {
		const content = `ping: ${this.client?.ws.ping}ms`;
		return message.reply(content);
	}
}
