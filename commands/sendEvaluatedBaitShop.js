const { prefix, embedColour, embedColourFail, embedColourSuccess } = require('../data/misc.json');
const baitData = require('../data/bait.json');
const { MessageEmbed } = require('discord.js');

const evaluateBaitShop = async (msg, commandReply, baitShopEmbed) => {
	const totalQP = parseInt(baitShopEmbed.description.replace(/\D/g, ''), 10);
	const baitShop = {};
	baitShopEmbed.fields.forEach((field, index) => {
		const obj = {};

		obj.price = parseInt(field.value.replace(/\D/g, ''), 10);
		obj.quantity = parseInt(field.name.slice(5).replace(/\D/g, ''), 10);
		obj.value = parseFloat((obj.price / obj.quantity).toFixed(2));
		obj.name = field.name.slice(5, field.name.search(/x/g) - 1);
		obj.percentOfQP = parseFloat(((obj.price / totalQP) * 100).toFixed(1));
		obj.recommendedPrice = baitData[obj.name.toLowerCase().replace(/\s/g, '_')].value;
		obj.valueDifference = parseFloat((obj.value - obj.recommendedPrice).toFixed(2));
		obj.rating = baitData[obj.name.toLowerCase().replace(/\s/g, '_')].rating;

		if (obj.valueDifference > 0) { obj.pricing = `**OVERPRICED** by ${obj.valueDifference} 🍭`; }
		else if (obj.valueDifference < 0) { obj.pricing = `**UNDERPRICED** by ${obj.valueDifference * -1} 🍭`; }
		else { obj.pricing = '**NEITHER** overpriced nor underpriced'; }

		obj.embedValue = `**Price**: ${obj.price} 🍭 [${obj.percentOfQP}% of your ${totalQP} 🍭]\
		\n\n${baitData[obj.name.toLowerCase().replace(/\s/g, '_')].description}\
		\n\n${obj.name} are ${obj.pricing}!\
		\n——————————————————————————`;

		baitShop[`bait${index + 1}`] = obj;
	});

	const baitShopEvaluation = new MessageEmbed()
		.setTitle('Bait Shop Evaluation')
		.setDescription(`You have ${totalQP} 🍭\nㅤ\n——————————————————————————`)
		.setFields([
			{
				name: `\`#1\` ${baitShop.bait1.name} x${baitShop.bait1.quantity} [${baitShop.bait1.rating}]`,
				value: baitShop.bait1.embedValue
			},
			{
				name: `\`#2\` ${baitShop.bait2.name} x${baitShop.bait2.quantity} [${baitShop.bait2.rating}]`,
				value: baitShop.bait2.embedValue
			},
			{
				name: `\`#3\` ${baitShop.bait3.name} x${baitShop.bait3.quantity} [${baitShop.bait3.rating}]`,
				value: baitShop.bait3.embedValue
			}
		])
		.setColor(embedColour);

	const baitShopEvalMsg = await msg.channel.send({ embeds: [baitShopEvaluation] });
	const commandReplyEmbed = new MessageEmbed()
		.setTitle('Bait Shop Info')
		.setDescription(`Bait Shop Evaluation sent! [Link](${baitShopEvalMsg.url})`)
		.setColor(embedColourSuccess);
	await commandReply.edit({ embeds: [commandReplyEmbed] });
};

module.exports.sendEvaluatedBaitShop = async (msg, cmd) => {
	const embedBase = new MessageEmbed()
		.setTitle('Bait Shop Info')
		.setColor(embedColour);

	const queryBaitShopEmbed = new MessageEmbed(embedBase)
		.setDescription('Please call the Bait Shop command using `.baitshop` or `.bs` so I can read the embed!')
		.setFooter({ text: 'This command will timeout after 10 seconds.' });

	const commandReply = await msg.reply({ embeds: [queryBaitShopEmbed] });

	const messageCollector = await msg.channel.createMessageCollector({ max: 10, idle: 10000 });
	messageCollector.on('collect', async (message) => {
		if (typeof message.embeds[0] === 'undefined' || message.embeds[0].title !== 'Welcome to the Bait Shop!') return;
		await messageCollector.stop('found');
		await evaluateBaitShop(msg, commandReply, message.embeds[0]);
	});

	messageCollector.on('end', async (msgs, reason) => {
		if (reason !== 'found') {
			const embedNotFound = new MessageEmbed(embedBase)
				.setDescription(`:warning: Bait Shop embed not detected, please run \`${prefix}${cmd}\` to try again.`)
				.setColor(embedColourFail);
			await commandReply.edit({ embeds: [embedNotFound] });
		}
	});
};
