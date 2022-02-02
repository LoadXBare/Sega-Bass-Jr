import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { BAITS, COLORS } from '../../config/constants';

export const evaluateBaitShop = async (message: Message): Promise<void> => {
	let ownerId: string;
	if (message.type === 'REPLY') ownerId = message.mentions.repliedUser.id;
	else if (message.type === 'APPLICATION_COMMAND') ownerId = message.interaction.user.id;

	await message.react('🔎');

	const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === '🔎' && user.id === ownerId;
	const reactions = await message.awaitReactions({ filter, max: 1, time: 10000 });
	if (reactions.size === 0) return;

	await message.reactions.removeAll();

	const baitShopEmbed = message.embeds.at(0);

	const totalQP = parseInt(baitShopEmbed.description.replace(/\D/g, ''), 10);
	const baitShop = {
		bait1: {
			name: '',
			quantity: 0,
			rating: '',
			value: 0,
			embedValue: ''
		},
		bait2: {
			name: '',
			quantity: 0,
			rating: '',
			value: 0,
			embedValue: ''
		},
		bait3: {
			name: '',
			quantity: 0,
			rating: '',
			value: 0,
			embedValue: ''
		}
	};
	baitShopEmbed.fields.forEach((field, index) => {
		const obj = {
			price: 0,
			quantity: 0,
			value: 0,
			name: '',
			percentOfQP: 0,
			recommendedPrice: 0,
			valueDifference: 0,
			rating: '',
			pricing: '',
			embedValue: ''
		};

		obj.price = parseInt(field.value.replace(/\D/g, ''), 10);
		obj.quantity = parseInt(field.name.slice(5).replace(/\D/g, ''), 10);
		obj.value = parseFloat((obj.price / obj.quantity).toFixed(2));
		obj.name = field.name.slice(5, field.name.search(/x/g) - 1);
		obj.percentOfQP = parseFloat(((obj.price / totalQP) * 100).toFixed(1));
		obj.recommendedPrice = BAITS[obj.name.toUpperCase().replace(/\s/g, '')].VALUE;
		obj.valueDifference = parseFloat((obj.value - obj.recommendedPrice).toFixed(2));
		obj.rating = BAITS[obj.name.toUpperCase().replace(/\s/g, '')].RATING;

		if (obj.valueDifference > 0) { obj.pricing = `**OVERPRICED** by ${obj.valueDifference} 🍭`; }
		else if (obj.valueDifference < 0) { obj.pricing = `**UNDERPRICED** by ${obj.valueDifference * -1} 🍭`; }
		else { obj.pricing = '**NEITHER** overpriced nor underpriced'; }

		obj.embedValue = `**Price**: ${obj.price} 🍭 [${obj.percentOfQP}% of your ${totalQP} 🍭]\
		\n\n${BAITS[obj.name.toUpperCase().replace(/\s/g, '')].DESCRIPTION}\
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
		.setColor(COLORS.MAIN);

	await message.reply({ embeds: [baitShopEvaluation] });
};