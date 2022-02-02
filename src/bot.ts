import { Client } from 'discord.js';
import { EVENTS, INTENTS } from './config/constants.js';
import { eventHandler } from './lib/event-handler.js';
import { TOKEN } from './private/config/constants.js';

const client = new Client({ intents: INTENTS });

EVENTS.forEach((event) => {
	client.on(event, (...args) => eventHandler(event, args));
	console.log(`Loaded event: ${event}`);
});

client.login(TOKEN);

/* TODO
 • Map stats to graph which can be sent using command
*/