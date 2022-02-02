import { Message, MessageEmbed } from 'discord.js';
import { COLORS } from '../config/constants';
import prisma from '../prisma/client';

export const enable = async (message: Message): Promise<void> => {
	await prisma.users.upsert({
		where: { userId: message.author.id },
		update: { timerEnable: true },
		create: { userId: message.author.id }
	});

	const fishRemindersEnabled = new MessageEmbed()
		.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
		.setTitle('Fishing Reminders')
		.setDescription('Successfully enabled fishing reminders!')
		.setFooter({ text: 'You will see a prompt next time you run the fish command.' })
		.setColor(COLORS.SUCCESS);

	await message.reply({ embeds: [fishRemindersEnabled] });
};