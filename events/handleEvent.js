const { handleCommand } = require('../commands/handleCommand');
const { onFishCommand } = require('./onFishCommand');
const { prefix, embedColour } = require('../data/misc.json');
const { logChannel } = require('../private/config.json');
const baitData = require('../data/bait.json');
const prisma = require('../prisma/client.js');
const { MessageEmbed } = require('discord.js');

const onReady = async (client) => {
	const logChnl = await client.channels.fetch(logChannel);

	require('../events/handleError.js')(client);
	require('../lib/reminderScheduler.js')(client);

	const logEmbed = new MessageEmbed()
		.setTitle(':information_source: New Log')
		.setDescription(`Successfully logged in as ${client.user.tag}!`)
		.setColor('GREEN')
		.setTimestamp(Date.now());

	client.user.setActivity({ name: 'people fish 🎣', type: 'WATCHING' });

	console.log(`Logged in as ${client.user.tag}!`);
	await logChnl.send({ embeds: [logEmbed] });
};

const onMessageCreate = async (msg) => {
	if (msg.author.bot && msg.author.id !== '803361191166607370') return;

	const isCommand = msg.content.startsWith(prefix);
	const isFishCommand = msg.content === '.f' || msg.content === '.fish' || msg.content.startsWith('.f ') || msg.content.startsWith('.fish ');

	if (isCommand) { handleCommand(msg, msg.client); }
	if (isFishCommand) { onFishCommand(msg); }

	if (msg.author.bot) {
		const sentEmbed = msg.embeds[0];
		if (typeof sentEmbed === 'undefined') { return; }

		if (sentEmbed.title === 'Bait Inventory') {
			const baitInv = sentEmbed.description.split('-');
			let totalPrice = 0;

			baitInv.shift();

			baitInv.forEach((bait) => {
				const baitName = bait.replace(/(?:^ |\n)/g, '').slice(0, bait.search(/\*/g) - 2).replace(/\s/g, '_');
				const baitQuantity = bait.replace(/\D/g, '');
				totalPrice += baitData[baitName].value * baitQuantity;
			});

			const baitInvValueEmbed = new MessageEmbed()
				.setFields([{
					name: 'Bait Inventory Value',
					value: `Your Bait Inventory is *estimated* to be worth **${totalPrice}** 🍭!`
				}])
				.setColor(embedColour);

			await msg.reply({ embeds: [baitInvValueEmbed] });
		} else if (sentEmbed.title.startsWith('You collected')) {
			const collectedAmount = parseInt(sentEmbed.title.replace(/\D/g, ''));
			let userId = '';

			if (msg.type === 'REPLY') userId = msg.mentions.repliedUser.id;
			else if (msg.type === 'APPLICATION_COMMAND') userId = msg.interaction.user.id;

			const userStats = await prisma.users.upsert({ where: { userId: userId }, update: {}, create: { userId: userId } });

			await prisma.users.update({
				where: { userId: userId },
				data: { coinsCollected: userStats.coinsCollected + collectedAmount }
			});
		}
	}
};

const onMessageUpdate = async (msgAfter) => {
	const msg = await msgAfter.fetch();
	const sentEmbed = msg.embeds[0];
	let userId = '';

	if (msg.author.id !== '803361191166607370') return;
	else if (typeof sentEmbed === 'undefined') return;

	if (msg.type === 'REPLY') userId = msg.mentions.repliedUser.id;
	else if (msg.type === 'APPLICATION_COMMAND') userId = msg.interaction.user.id;

	if (sentEmbed.title.startsWith('Caught a')) {
		const embedDesc = sentEmbed.description.split('\n');

		if (embedDesc[0].includes(':gloves:')) embedDesc.shift();

		const fishStats = {
			coinsEarned: embedDesc[0].slice(0, embedDesc[0].search(/\(/g)).replace(/\D/g, ''),
			bonusCoinsEarned: embedDesc[0].slice(embedDesc[0].search(/\(/g)).replace(/\D/g, ''),
			expEarned: embedDesc[1].slice(0, embedDesc[1].search(/\(/g)).replace(/\D/g, ''),
			bonusExpEarned: embedDesc[1].slice(embedDesc[1].search(/\(/g)).replace(/\D/g, ''),
			fishCaught: 1
		};

		for (const stat in fishStats) {
			if (isNaN(parseInt(fishStats[stat]))) { fishStats[stat] = 0; }
			else { fishStats[stat] = parseInt(fishStats[stat]); }
		}

		if (sentEmbed.fields[0].value.includes('kg')) {
			fishStats.weightCaught = sentEmbed.fields[0].value.replace(/[a-z]/g, '');
			fishStats.weightCaught = parseFloat(fishStats.weightCaught) * 1000;
		} else {
			fishStats.weightCaught = sentEmbed.fields[0].value.replace(/\D/g, '');
			fishStats.weightCaught = parseInt(fishStats.weightCaught);
		}

		fishStats.totalCoinsEarned = fishStats.coinsEarned + fishStats.bonusCoinsEarned;
		fishStats.totalExpEarned = fishStats.expEarned + fishStats.bonusExpEarned;

		const userStats = await prisma.users.upsert({ where: { userId: userId }, update: {}, create: { userId: userId } });

		await prisma.users.update({
			where: { userId: userId },
			data: {
				bonusCoinsEarned: userStats.bonusCoinsEarned + fishStats.bonusCoinsEarned,
				bonusExpEarned: userStats.bonusExpEarned + fishStats.bonusExpEarned,
				coinsEarned: userStats.coinsEarned + fishStats.coinsEarned,
				expEarned: userStats.expEarned + fishStats.expEarned,
				fishCaught: userStats.fishCaught + fishStats.fishCaught,
				totalCoinsEarned: userStats.totalCoinsEarned + fishStats.totalCoinsEarned,
				totalExpEarned: userStats.totalExpEarned + fishStats.totalExpEarned,
				weightCaught: userStats.weightCaught + fishStats.weightCaught
			}
		});
	} else if (sentEmbed.title.startsWith('Oh no!')) {
		const userStats = await prisma.users.upsert({ where: { userId: userId }, update: {}, create: { userId: userId } });

		await prisma.users.update({
			where: { userId: userId },
			data: { fishLost: userStats.fishLost + 1 }
		});
	}
};

module.exports.handleEvent = async (event, options) => {
	const { msg, client, msgAfter } = options;
	if (event === 'messageCreate') { onMessageCreate(msg); }
	else if (event === 'ready') { onReady(client); }
	else if (event === 'messageUpdate') { onMessageUpdate(msgAfter); }
};
