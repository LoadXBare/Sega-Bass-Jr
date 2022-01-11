const { prefix, embedColour, embedColourFail } = require('../data/misc.json');
const baitData = require('../data/bait.json');

module.exports.sendEvaluatedBaitShop = async (msg, cmd, client) => {
	const channel = await client.channels.fetch(msg.channel.id);
	let embed;

	embed = {
		title: 'Bait Shop Info',
		color: embedColour,
		description: 'Please call the Bait Shop command using `.baitshop` or `.bs` so I can read them embed!',
		footer: { text: 'This command will timeout after 10 seconds.' }
	};

	const commandReply = await msg.reply({ embeds: [embed] });
	const messages = await channel.awaitMessages({ max: 2, idle: 10000 });

	if (messages.size < 2 || typeof messages.at(1).embeds[0] === 'undefined') {
		embed = {
			color: embedColourFail,
			description: `:warning: No embed detected, please run \`${prefix}${cmd}\` to try again.`
		};
		commandReply.edit({ embeds: [embed] });
		return;
	} else if (messages.at(1).embeds[0].title !== 'Welcome to the Bait Shop!') {
		embed = {
			color: embedColourFail,
			description: `:warning: Wrong embed detected, please run \`${prefix}${cmd}\` to try again.`
		};
		commandReply.edit({ embeds: [embed], allowedMentions: { repliedUser: true } });
		return;
	}
	const baitShopEmbed = messages.at(1).embeds[0];
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

	messages.at(0).delete();
	messages.at(1).delete();

	embed = {
		title: 'Bait Shop Evaluation',
		color: embedColour,
		description: `You have ${totalQP} 🍭\nㅤ\n——————————————————————————`,
		fields: [
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
		}]
	};

	commandReply.edit({ embeds: [embed] });
};
