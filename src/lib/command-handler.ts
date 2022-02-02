import { Message } from 'discord.js';
import * as commands from '../commands/index.js';
import { PREFIX } from '../config/constants.js';

export const commandHandler = async (message: Message): Promise<void> => {
	const commandArgs = message.content.split(' ');
	const command = commandArgs[0].slice(PREFIX.length, commandArgs[0].length);
	commandArgs.shift();

	commands[command](message, commandArgs);
};