import { Message, MessageEmbed, User } from 'discord.js';
import { COLORS } from '../config/constants';
import prisma from '../prisma/client';

export const stats = async (message: Message, commandArgs: string[]) => {
	const embedBase = new MessageEmbed()
		.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
		.setTitle('Fishing Statistics');

	let user: User;
	if (typeof commandArgs[0] !== 'undefined') {
		const userId = commandArgs[0].replace(/\D/g, '');

		try {
			user = await message.client.users.fetch(userId);
		} catch {
			const error = new MessageEmbed(embedBase)
				.setDescription(`:warning: \`${commandArgs[0]}\` is not a valid user!`)
				.setColor(COLORS.FAIL);

			await message.reply({ embeds: [error] });
			return;
		}
	} else {
		user = await message.client.users.fetch(message.author.id);
	}

	const userStats = await prisma.users.upsert({
		where: { userId: user.id },
		update: {},
		create: { userId: user.id }
	});

	const fishingStatsEmbed = new MessageEmbed(embedBase)
		.setDescription(
			`Here are the "lifetime" fishing statistics for: \`${user.tag}\`!\
			\n:coin: Coins Earned: \`${userStats.coinsEarned}\`\
			\n:coin: Bonus Coins Earned: \`${userStats.bonusCoinsEarned}\`\
			\n:coin: Total Coins Earned: \`${userStats.totalCoinsEarned}\`\
			\n:coin: Coins Collected: \`${userStats.coinsCollected}\`\
			\n\n:star: Exp Earned: \`${userStats.expEarned}\`\
			\n:star: Bonus Exp Earned: \`${userStats.bonusExpEarned}\`\
			\n:star: Total Exp Earned: \`${userStats.totalExpEarned}\`\
			\n\n:fish: Total Fish Caught: \`${userStats.fishCaught}\`\
			\n:fish: Total Fish Lost: \`${userStats.fishLost}\`\
			\n:scales: Total Weight Caught: \`${(userStats.weightCaught / 1000).toFixed(3)}kg\``
		)
		.setFooter({ text: 'All data shown has been gathered since 30/01/2022' })
		.setColor(COLORS.SUCCESS);

	await message.reply({ embeds: [fishingStatsEmbed] });
};