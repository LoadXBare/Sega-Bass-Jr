import { Message } from 'discord.js';
import prisma from '../../prisma/client.js';

interface FishStats {
	coinsEarned: number,
	bonusCoinsEarned: number,
	totalCoinsEarned: number,
	expEarned: number,
	bonusExpEarned: number,
	totalExpEarned: number,
	weightCaught: number,
	fishCaught: number
}

export const handleFishCaught = async (message: Message): Promise<void> => {
	const sentEmbed = message.embeds.at(0);
	const sentEmbedDescription = sentEmbed.description.split('\n');

	let userId: string;
	if (message.type === 'REPLY') userId = message.mentions.repliedUser.id;
	else if (message.type === 'APPLICATION_COMMAND') userId = message.interaction.user.id;


	if (sentEmbedDescription[0].includes('gloves')) sentEmbedDescription.shift();

	// TODO: Make this logic more readable

	const caughtFishStats: FishStats = {
		coinsEarned: parseInt(sentEmbedDescription[0].slice(0, sentEmbedDescription[0].search(/\(/g)).replace(/\D/g, '')),
		bonusCoinsEarned: parseInt(sentEmbedDescription[0].slice(sentEmbedDescription[0].search(/\(/g)).replace(/\D/g, '')),
		expEarned: parseInt(sentEmbedDescription[1].slice(0, sentEmbedDescription[1].search(/\(/g)).replace(/\D/g, '')),
		bonusExpEarned: parseInt(sentEmbedDescription[1].slice(sentEmbedDescription[1].search(/\(/g)).replace(/\D/g, '')),
		fishCaught: 1,
		weightCaught: null,
		totalCoinsEarned: null,
		totalExpEarned: null
	};

	for (const stat in caughtFishStats) {
		if (isNaN(caughtFishStats[stat])) caughtFishStats[stat] = 0;
	}

	if (sentEmbed.fields[0].value.includes('kg')) {
		caughtFishStats.weightCaught = parseFloat(sentEmbed.fields[0].value.replace(/[a-z]/g, '')) * 1000;
	} else {
		caughtFishStats.weightCaught = parseInt(sentEmbed.fields[0].value.replace(/\D/g, ''));
	}

	caughtFishStats.totalCoinsEarned = caughtFishStats.coinsEarned + caughtFishStats.bonusCoinsEarned;
	caughtFishStats.totalExpEarned = caughtFishStats.expEarned + caughtFishStats.bonusExpEarned;

	const userStats = await prisma.users.upsert({
		where: { userId: userId },
		update: {},
		create: { userId: userId }
	});

	await prisma.users.update({
		where: { userId: userId },
		data: {
			bonusCoinsEarned: userStats.bonusCoinsEarned + caughtFishStats.bonusCoinsEarned,
			bonusExpEarned: userStats.bonusExpEarned + caughtFishStats.bonusExpEarned,
			coinsEarned: userStats.coinsEarned + caughtFishStats.coinsEarned,
			expEarned: userStats.expEarned + caughtFishStats.expEarned,
			fishCaught: userStats.fishCaught + caughtFishStats.fishCaught,
			totalCoinsEarned: userStats.totalCoinsEarned + caughtFishStats.totalCoinsEarned,
			totalExpEarned: userStats.totalExpEarned + caughtFishStats.totalExpEarned,
			weightCaught: userStats.weightCaught + caughtFishStats.weightCaught
		}
	});
};