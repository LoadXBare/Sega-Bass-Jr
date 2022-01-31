const { embedColourSuccess, embedColourFail } = require('../data/misc.json');
const { MessageEmbed } = require('discord.js');
const prisma = require('../prisma/client.js');

module.exports.sendFishingStats = async (msg, args) => {
	let userId = '';
	const embedBase = new MessageEmbed()
		.setAuthor({ name: msg.author.tag, iconURL: msg.author.avatarURL() })
		.setTitle('Fishing Statistics');

	if (typeof args[0] !== 'undefined') {
		userId = args[0].replace(/\D/g, '');

		try { await msg.client.users.fetch(userId); }
		catch {
			const errorEmbed = new MessageEmbed(embedBase)
				.setDescription(`:warning: \`${args[0]}\` is not a valid user!`)
				.setColor(embedColourFail);

			await msg.reply({ embeds: [errorEmbed] });
			return;
		}
	} else { userId = msg.author.id; }

	const userStats = await prisma.users.upsert({ where: { userId: userId }, update: {}, create: { userId: userId } });
	const user = await msg.client.users.fetch(userId);

	const fishingStatsEmbed = new MessageEmbed()
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
		.setColor(embedColourSuccess);

	await msg.reply({ embeds: [fishingStatsEmbed] });
};
