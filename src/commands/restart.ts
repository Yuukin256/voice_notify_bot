import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class RestartBotCommand extends Command {
	constructor() {
		super('restartBot', {
			aliases: ['restart'],
			description: 'Botプログラムを再起動する',
		});
	}
	async exec(message: Message) {
		const content = `Botを再起動します...`;
		await message.reply(content);
		this.client?.destroy();
		process.exit();
	}
}
