import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { config } from './database';
import path from 'path';
// import { commandListMaker } from './util';

export class MyClient extends AkairoClient {
	commandHandler: CommandHandler;
	listenerHandler: ListenerHandler;
	config: typeof config;

	constructor() {
		super(
			{
				disableMentions: 'everyone',
			},
			{ shards: 'auto' }
		);

		this.commandHandler = new CommandHandler(this, {
			directory: path.join(__dirname, 'commands/'),
			prefix: async (message) => {
				if (!message.guild) return '))';
				const guildConfig = await this.config.get(message.guild.id);
				return guildConfig.prefix || '))';
			},
			allowMention: true,
			commandUtil: true,
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: path.join(__dirname, 'listeners/'),
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();

		// this.commandHandler.on('messageInvalid', (message) => {
		// 	const content = `コマンド \`${message.content}\` は存在しません`;
		// 	const embed = this.util
		// 		.embed()
		// 		.setTitle('コマンド一覧')
		// 		.addFields(commandListMaker(this.commandHandler));
		// 	message.channel.send(content, embed);
		// });

		this.config = config;
	}
}
