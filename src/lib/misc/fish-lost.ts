import { Message } from 'discord.js';
import prisma from '../../prisma/client';

export const handleFishLost = async (message: Message): Promise<void> => {
	let userId: string;
	if (message.type === 'REPLY') userId = message.mentions.repliedUser.id;
	else if (message.type === 'APPLICATION_COMMAND') userId = message.interaction.user.id;

	const userStats = await prisma.users.upsert({
		where: { userId: userId },
		update: {},
		create: { userId: userId }
	});

	await prisma.users.update({
		where: { userId: userId },
		data: { fishLost: userStats.fishLost + 1 }
	});
};