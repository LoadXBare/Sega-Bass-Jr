import { Client, MessageEmbed, TextChannel } from 'discord.js';
import { startScheduler } from '../lib/reminder-scheduler.js';
import { CHANNELS } from '../private/config/constants.js';

export const ready = async (args: unknown): Promise<void> => {
	const client = args[0] as Client;
	const logChannel = await client.channels.fetch(CHANNELS.LOG) as TextChannel;

	const logEmbed: MessageEmbed = new MessageEmbed()
		.setTitle(':information_source: New Log')
		.setDescription(`Successfully logged in as ${client.user.tag}!`)
		.setColor('GREEN')
		.setTimestamp(Date.now());

	client.user.setActivity({ name: 'people fish 🎣', type: 'WATCHING' });

	console.log(`Successfully logged in as ${client.user.tag}!`);
	await logChannel.send({ embeds: [logEmbed] }); // TODO: move to private/logger.ts ?
	startScheduler(client);
};