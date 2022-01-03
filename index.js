const { Client, MessageEmbed, Intents } = require('discord.js');
const { Token } = require('./config.json');
const { baitPrices, baitRatings, baitInfo } = require('./data.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const embedColour = '#3479d0';
const prefix = ',';
let requestsSatisfied = 0;

client.on('ready', () => {
	client.user.setActivity({ name: 'bait shop prices', type: 'WATCHING' });
	// eslint-disable-next-line no-console
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
	const command = message.content.toLowerCase().slice(0, message.content.search(/\s/g) === -1 ? message.content.length : message.content.search(/\s/g));
	const args = message.content.slice(command.length).trim().toLowerCase().split(' ');

	if (command === `${prefix}stats`) {
		const uptimeSecs = Math.floor(client.uptime / 1000);
		const botUptime = {
			secs: uptimeSecs % 60,
			mins: Math.floor(uptimeSecs / 60) % 60,
			hours: Math.floor(uptimeSecs / 3600) % 24,
			days: Math.floor(uptimeSecs / 86400),
		};

		requestsSatisfied += 1;

		const embed = new MessageEmbed()
			.setColor(embedColour)
			.setTitle('Bot Stats')
			.addFields({
					name: 'Uptime',
					value: `I have been online for **${botUptime.days} days, ${botUptime.hours} hours, ${botUptime.mins} minutes, ${botUptime.secs} seconds**!`,
				}, {
					name: 'Requests Satisified',
					value: `I have satisified a total of **${requestsSatisfied} requests**!`,
				});

		message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	} else if (command === `${prefix}ii`) {
		let baitName;

		if (args[1] === 'cutbait') {
			baitName = `${args[0].charAt(0).toUpperCase() + args[0].slice(1)}_${args[1].charAt(0).toUpperCase() + args[1].slice(1)}`;
		} else {
			baitName = `${args[0].charAt(0).toUpperCase() + args[0].slice(1)}`;
		}

		try {
			const embed = new MessageEmbed()
			.setTitle(`${baitName.replace('_', ' ')} [${baitRatings[baitName.toLowerCase()]}]`)
			.setDescription(baitInfo[baitName.toLowerCase()].description)
			.setColor(embedColour)
			.setThumbnail(baitInfo[baitName.toLowerCase()].imageURL);

			message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } });
			requestsSatisfied += 1;
		} catch {
			const embed = new MessageEmbed()
				.setDescription(`:warning: \`${baitName}\` is not a valid bait!`)
				.setColor(embedColour);

			message.channel.send({ embeds: [embed] });
			return;
		}
	}

	if (message.author.id === '803361191166607370') {
		message.embeds.forEach((embed) => {
			if (embed.title === 'Bait Inventory') {
				const baitInv = embed.description.split('-');
				let totalPrice = 0;

				baitInv.shift();

				for (let i = 0; i < baitInv.length; i += 1) {
					baitInv[i] = baitInv[i].replace(/\n/g, '').trim();

					const name = baitInv[i].slice(0, baitInv[i].search('[*]') - 1).replace(/\s/g, '_');
					const quantity = baitInv[i].replace(/\D/g, '');

					totalPrice += baitPrices[name] * quantity;
				}

				const msgEmbed = new MessageEmbed().setColor(embedColour).addFields({
					name: 'Bait Inventory Value',
					value: `Your Bait Inventory is *estimated* to be worth **${totalPrice} 🍭**!`,
				});

				message.reply({ embeds: [msgEmbed], allowedMentions: { repliedUser: false } });
				requestsSatisfied += 1;
			} else if (embed.title === 'Welcome to the bait shop!') {
				const totalQuestPoints = embed.description.replace(/\D/g, ''); // Quest Points is the name for 🍭
				const baitData = {
					bait0: {},
					bait1: {},
					bait2: {},
				};

				for (let i = 0; i < embed.fields.length; i += 1) {
					baitData[`bait${i}`].quantity = embed.fields[i].name.replace(/\D/g, '');
					baitData[`bait${i}`].value = embed.fields[i].value.replace(/\D/g, '');
					baitData[`bait${i}`].name = embed.fields[i].name.slice(embed.fields[i].name.search('[A-Z]'), embed.fields[i].name.search('x') - 1);
					baitData[`bait${i}`].price = (baitData[`bait${i}`].value / baitData[`bait${i}`].quantity).toFixed(2);
					baitData[`bait${i}`].rp = baitPrices[baitData[`bait${i}`].name.replace(/\s/g, '_').toLowerCase()];
					baitData[`bait${i}`].sr = baitRatings[baitData[`bait${i}`].name.replace(/\s/g, '_').toLowerCase()];
					baitData[`bait${i}`].percent = ((baitData[`bait${i}`].value / totalQuestPoints) * 100).toFixed(1);
					baitData[`bait${i}`].diff = (baitData[`bait${i}`].price - baitData[`bait${i}`].rp).toFixed(2);

					if (baitData[`bait${i}`].price > baitData[`bait${i}`].rp) baitData[`bait${i}`].pricing = `**OVERPRICED** by ${baitData[`bait${i}`].diff} 🍭`;
					else if (baitData[`bait${i}`].price === baitData[`bait${i}`].rp) baitData[`bait${i}`].pricing = 'at **RECOMMENDED PRICE**';
					else baitData[`bait${i}`].pricing = `**UNDERPRICED** by ${baitData[`bait${i}`].diff * -1} 🍭`;

					baitData[`bait${i}`].embedValue = `**Price**: ${baitData[`bait${i}`].value} 🍭 (${baitData[`bait${i}`].price} 🍭 each) [${baitData[`bait${i}`].percent}% of your QP]\n`
					+ `**Recommended Price**: ${baitData[`bait${i}`].rp} 🍭\n\n`
					+ `${baitData[`bait${i}`].name} are ${baitData[`bait${i}`].pricing}!`;
				}

				const msgEmbed = new MessageEmbed()
					.setColor(embedColour)
					.addFields({
						name: `:one: ${baitData.bait0.name} x${baitData.bait0.quantity} [${baitData.bait0.sr}]`,
						value: baitData.bait0.embedValue,
					}, {
						name: `:two: ${baitData.bait1.name} x${baitData.bait1.quantity} [${baitData.bait1.sr}]`,
						value: baitData.bait1.embedValue,
					}, {
						name: `:three: ${baitData.bait2.name} x${baitData.bait2.quantity} [${baitData.bait2.sr}]`,
						value: baitData.bait2.embedValue,
					});

				message.reply({ embeds: [msgEmbed], allowedMentions: { repliedUser: false } });
				requestsSatisfied += 1;
			}
		});
	}
});

client.login(Token);

/*
? cache current baitshop data so no need for re-read of embed
? track statistics of fishing (times fished, fish got, trash got, weight got, money got, exp got)
? map statistics to graph which can be sent using command
*/
