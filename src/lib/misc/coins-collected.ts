import { Message } from 'discord.js';
import prisma from '../../prisma/client.js';

export const handleCoinsCollected = async (message: Message) => {
	const sentEmbed = message.embeds.at(0);
	const collectedAmount = parseInt(sentEmbed.title.replace(/\D/g, ''));
	let userId: string;

	if (message.type === 'REPLY') userId = message.mentions.repliedUser.id;
	else if (message.type === 'APPLICATION_COMMAND') userId = message.interaction.user.id;

	const userStats = await prisma.users.upsert({ where: { userId: userId }, update: {}, create: { userId: userId } });

	await prisma.users.update({
		where: { userId: userId },
		data: { coinsCollected: userStats.coinsCollected + collectedAmount }
	});
};