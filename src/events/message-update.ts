import { Message } from 'discord.js';
import { handleCoinsCollected } from '../lib/misc/coins-collected.js';
import { evaluateBaitInventory } from '../lib/misc/eval-bait-inventory.js';
import { evaluateBaitShop } from '../lib/misc/eval-bait-shop.js';
import { handleFishCaught } from '../lib/misc/fish-caught.js';
import { handleFishLost } from '../lib/misc/fish-lost.js';

export const messageUpdate = async (args) => {
	const messageAfter = args[1] as Message;

	const isBaitInvEmbed =
		messageAfter.type === 'APPLICATION_COMMAND' &&
		typeof messageAfter.embeds.at(0) !== 'undefined' &&
		messageAfter.embeds.at(0).title === 'Bait Inventory';
	const isBaitShopEmbed =
		messageAfter.type === 'APPLICATION_COMMAND' &&
		typeof messageAfter.embeds.at(0) !== 'undefined' &&
		messageAfter.embeds.at(0).title === 'Welcome to the Bait Shop!';
	const isCollectedEmbed =
		messageAfter.type === 'APPLICATION_COMMAND' &&
		typeof messageAfter.embeds.at(0) !== 'undefined' &&
		messageAfter.embeds.at(0).title.startsWith('You collected');
	const isFishCaughtEmbed =
		messageAfter.type === 'REPLY' &&
		typeof messageAfter.embeds.at(0) !== 'undefined' &&
		messageAfter.embeds.at(0).title.startsWith('Caught a');
	const isFishLostEmbed =
		messageAfter.type === 'REPLY' &&
		typeof messageAfter.embeds.at(0) !== 'undefined' &&
		messageAfter.embeds.at(0).title.startsWith('Oh no!');

	if (isBaitInvEmbed) evaluateBaitInventory(messageAfter);
	else if (isBaitShopEmbed) evaluateBaitShop(messageAfter);
	else if (isCollectedEmbed) handleCoinsCollected(messageAfter);
	else if (isFishCaughtEmbed) handleFishCaught(messageAfter);
	else if (isFishLostEmbed) handleFishLost(messageAfter);

};