const { Client, Intents } = require('discord.js');
const { handleCommand } = require('./commands/handleCommand');
const { prefix, embedColour } = require('./data/misc.json');
const baitData = require('./data/bait.json');
const { token } = require('./private/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', async () => {
	client.user.setActivity({ name: 'bait shop prices', type: 'WATCHING' });
	// eslint-disable-next-line no-console
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (msg) => {
	const isCommand = msg.content.startsWith(prefix);

	if (isCommand) { handleCommand(msg, client); }

	if (msg.author.id === '803361191166607370') {
		let embed = msg.embeds.at(0);

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
});

client.login(token);

/*
TODO: move bait inv evaluation over to evaluate command
TODO: implement best/worst case scenario for bait shop prices using open-sourced data
? command to generate a bait shop
? track statistics of fishing (times fished, fish got, trash got, weight got, money got, exp got)
? map statistics to graph which can be sent using command
*/
