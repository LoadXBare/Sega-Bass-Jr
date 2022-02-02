import { Message, MessageEmbed } from 'discord.js';
import { PREFIX } from '../config/constants.js';
import { commandHandler } from '../lib/command-handler.js';
import { handleCoinsCollected } from '../lib/misc/coins-collected.js';
import { evaluateBaitInventory } from '../lib/misc/eval-bait-inventory.js';
import { evaluateBaitShop } from '../lib/misc/eval-bait-shop.js';
import { handleFishCommand } from '../lib/misc/fish-command.js';

export const messageCreate = async (args) => {
	const message = args[0] as Message;
	if (message.author.bot && message.author.id !== '803361191166607370') return;

	const isBotCommand: boolean = message.content.startsWith(PREFIX);
	const isFishCommand: boolean =
		message.content === '.f' ||
		message.content === '.fish' ||
		message.content.startsWith('.f ') ||
		message.content.startsWith('.fish ');

	if (isBotCommand) {
		commandHandler(message);
	}
	if (isFishCommand) {
		handleFishCommand(message);
	}

	if (message.author.bot) {
		if (typeof message.embeds.at(0) === 'undefined') return;
		const sentEmbed = message.embeds.at(0) as MessageEmbed;

		const isBaitInvEmbed = sentEmbed.title === 'Bait Inventory';
		const isCollectedEmbed = sentEmbed.title.startsWith('You collected');
		const isBaitShopEmbed = sentEmbed.title === 'Welcome to the Bait Shop!';

		if (isBaitInvEmbed) evaluateBaitInventory(message);
		else if (isBaitShopEmbed) evaluateBaitShop(message);
		else if (isCollectedEmbed) handleCoinsCollected(message);
	}
};