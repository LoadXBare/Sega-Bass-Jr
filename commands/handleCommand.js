const { enableFishReminder } = require('./enableFishReminder');
const { sendEvaluatedBaitShop } = require('./sendEvaluatedBaitShop');
const { sendFishingStats } = require('./sendFishingStats');
const { sendHelpInfo } = require('./sendHelpInfo');
const { setCooldown } = require('./setCooldown');
const { prefix } = require('../data/misc.json');

module.exports.handleCommand = async (msg, client) => {
	const args = msg.content.split(' ');
	const cmd = args[0].slice(prefix.length, args[0].length);
	args.shift();

	if (cmd === 'evalbs') { sendEvaluatedBaitShop(msg, cmd, client); }
	else if (cmd === 'help') { sendHelpInfo(msg); }
	else if (cmd === 'set') { setCooldown(msg, args); }
	else if (cmd === 'enable') { enableFishReminder(msg); }
	else if (cmd === 'stats') { sendFishingStats(msg, args); }
};
