import { Users } from '@prisma/client';
import { Client, MessageEmbed, TextChannel } from 'discord.js';
import { COLORS } from '../config/constants';
import prisma from '../prisma/client';

const sendReminder = async (client: Client, user: Users): Promise<void> => {
	await prisma.users.update({
		where: { userId: user.userId },
		data: { timerActive: false }
	});

	const discordUser = await client.users.fetch(user.userId);
	const fishChannel = await client.channels.fetch(user.channelId) as TextChannel;
	const fishMessage = await fishChannel.messages.fetch(user.messageId);

	const fishingReminder = new MessageEmbed()
		.setDescription(`**Hey!** ${user.userCooldown} minutes have passed!\
		\n\n**GO FISH!** 🎣`)
		.setColor(COLORS.MAIN);

	try { await discordUser.send({ embeds: [fishingReminder] }); }
	catch { await fishMessage.reply({ content: 'I had some trouble reaching your DMs. Regardless, here is your reminder!', embeds: [fishingReminder] }); }
};

export const startScheduler = (client: Client): void => {
	setInterval(async () => {
		const users = await prisma.users.findMany({
			where: { timerActive: { equals: true } }
		});

		users.forEach(async (user) => {
			if (user.endTimestamp <= Math.ceil(Date.now() / 1000)) await sendReminder(client, user);
		});
	}, 1000);
};