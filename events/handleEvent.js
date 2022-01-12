const { handleCommand } = require('../commands/handleCommand');
const { onFishCommand } = require('./onFishCommand');
const db = require('../database');
const { prefix, embedColour, changelog } = require('../data/misc.json');
const { logChannel } = require('../private/config.json');
const baitData = require('../data/bait.json');

const onReady = async (client) => {
	const channelsToNotify = ['868149626321141780', '875462536609284136'];
	const embed = {
		title: 'Bot Restarted :warning:',
		description: '**Any active timers have been stopped and reset, sorry for any inconveniece caused.**',
		fields: changelog.latest,
		color: embedColour
	};
	const logEmbed = {
		title: 'ℹ️ New Log',
		description: `Successfully logged in as ${client.user.tag}!`,
		color: 'GREEN',
		timestamp: Date.now()
	};

	await db.users.updateAllUsers('timerActive', false);
	channelsToNotify.forEach(async (chnl) => {
		const channel = await client.channels.fetch(chnl);
		channel.send({ embeds: [embed] }); // ! UNCOMMENT IN PRODUCTION ! //
	});

	client.user.setActivity({ name: 'people fish 🎣', type: 'WATCHING' });
	// eslint-disable-next-line no-console
	console.log(`Logged in as ${client.user.tag}!`);
	await client.channels.cache.get(logChannel).send({ embeds: [logEmbed] });
};

const onMessageCreate = async (msg, client) => {
	const isCommand = msg.content.startsWith(prefix);
	const isFishCommand = msg.content === '.f' || msg.content === '.fish' || msg.content.startsWith('.f ') || msg.content.startsWith('.fish ');
	// if (msg.guild.id !== '611592496442769449') { return; } // ! COMMENT IN PRODUCTION ! //

	if (isCommand) { handleCommand(msg, client); }
	if (isFishCommand) { onFishCommand(msg); }

	if (msg.author.id === '803361191166607370') {
		let embed = msg.embeds[0];
		if (typeof embed === 'undefined') { return; }

		if (embed.title === 'Bait Inventory') {
			const baitInv = embed.description.split('-');
			let totalPrice = 0;

			baitInv.shift();

			baitInv.forEach((bait) => {
				const name = bait.replace(/(?:^ |\n)/g, '').slice(0, bait.search(/\*/g) - 2).replace(/\s/g, '_');
				const quantity = bait.replace(/\D/g, '');
				totalPrice += baitData[name].value * quantity;
			});

			embed = {
				color: embedColour,
				fields: [{
					name: 'Bait Inventory Value',
					value: `Your Bait Inventory is *estimated* to be worth **${totalPrice}** 🍭!`
				}]
			};

			msg.reply({ embeds: [embed] });
		}
	}
};

module.exports.handleEvent = async (event, client, msg) => {
	if (event === 'messageCreate') { onMessageCreate(msg, client); }
	else if (event === 'ready') { onReady(client); }
};