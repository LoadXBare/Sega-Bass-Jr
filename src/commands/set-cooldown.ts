import { inlineCode } from '@discordjs/builders';
import { Message, MessageEmbed } from 'discord.js';
import { COLORS } from '../config/constants';
import prisma from '../prisma/client';

export const set = async (message: Message, commandArgs: string[]): Promise<void> => {
	const cooldown = parseInt(commandArgs[0], 10);
	const embedBase = new MessageEmbed()
		.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
		.setTitle('Cooldown');

	if (isNaN(cooldown) || cooldown > 99999 || cooldown < 0) {
		const error = new MessageEmbed(embedBase)
			.setDescription(`:warning: ${inlineCode(commandArgs[0])} must be a whole number between 0 and 99,999!`)
			.setColor(COLORS.FAIL);

		await message.reply({ embeds: [error] });
		return;
	}

	await prisma.users.upsert({
		where: { userId: message.author.id },
		update: { userCooldown: cooldown },
		create: { userId: message.author.id, userCooldown: cooldown }
	});

	const cooldownSetSuccessfully = new MessageEmbed(embedBase)
		.setDescription(`Successfully set your cooldown to **${cooldown} minutes**!\
		\n\n***NOTE:*** *This does not start a timer! If you wish to start a timer, run the fish command and select "Yes" on the prompt that pops up.*`)
		.setColor(COLORS.SUCCESS);

	await message.reply({ embeds: [cooldownSetSuccessfully] });
};