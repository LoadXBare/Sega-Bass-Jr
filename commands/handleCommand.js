const { sendEvaluatedBaitShop } = require('./sendEvaluatedBaitShop');
const { sendBaitInfo } = require('./sendBaitInfo');
const { sendHelpInfo } = require('./sendHelpInfo');
const { sendUptime } = require('./sendUptime');
const { setCooldown } = require('./setCooldown');
const { prefix } = require('../data/misc.json');
const { enableFishReminder } = require('./enableFishReminder');

module.exports.handleCommand = async (msg, client) => {
	const args = msg.content.split(' ');
	const cmd = args[0].slice(prefix.length, args[0].length);
	args.shift();

	if (cmd === 'evalbs') { sendEvaluatedBaitShop(msg, cmd, client); }
	else if (cmd === 'uptime') { sendUptime(msg, client); }
	else if (cmd === 'bi') { sendBaitInfo(msg, args); }
	else if (cmd === 'help') { sendHelpInfo(msg); }
	else if (cmd === 'set') { setCooldown(msg, args); }
	else if (cmd === 'enable') { enableFishReminder(msg); }
};