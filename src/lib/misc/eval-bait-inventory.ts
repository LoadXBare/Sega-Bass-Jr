import { bold, italic } from '@discordjs/builders';
import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { BAITS, COLORS } from '../../config/constants.js';

export const evaluateBaitInventory = async (message: Message): Promise<void> => {
	let ownerId: string;
	if (message.type === 'REPLY') ownerId = message.mentions.repliedUser.id;
	else if (message.type === 'APPLICATION_COMMAND') ownerId = message.interaction.user.id;

	await message.react('🔎');

	const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === '🔎' && user.id === ownerId;
	const reactions = await message.awaitReactions({ filter, max: 1, time: 10000 });
	if (reactions.size === 0) return;

	await message.reactions.removeAll();

	const baitInvEmbed = message.embeds.at(0);
	const baitInv = baitInvEmbed.description.split('-');
	baitInv.shift();


	let totalValue = 0;
	baitInv.forEach((bait) => {
		const baitName = bait.slice(0, bait.search(/\*/g) - 1).replace(/\s/g, '').toUpperCase();
		const baitQuantity = parseInt(bait.replace(/\D/g, ''));
		totalValue += BAITS[baitName].VALUE * baitQuantity;
	});

	const baitInventoryValue: MessageEmbed = new MessageEmbed()
		.setFields([{
			name: 'Bait Inventory Value',
			value: `Your Bait Inventory is ${italic('estimated')} to be worth ${bold(totalValue.toString())} 🍭!`
		}])
		.setColor(COLORS.MAIN);

	await message.reply({ embeds: [baitInventoryValue] });
};