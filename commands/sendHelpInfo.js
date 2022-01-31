const { MessageEmbed } = require('discord.js');
const { prefix, embedColour } = require('../data/misc.json');

module.exports.sendHelpInfo = async (msg) => {
	const helpEmbed = new MessageEmbed()
		.setTitle('__Bot Info__')
		.setColor(embedColour)
		.setFields([{
			name: 'Prefix',
			value: 'My prefix is `,`!'
		}, {
			name: 'Command Arguments',
			value: 'Arguments surrounded with `< >` are **required**,\narguments surrounded with `[ ]` are **optional**.'
		}, {
			name: 'Evaluate Bait Shop',
			value: `\`${prefix}evalbs\`\
				\nReturns statistics related to Big Tuna's current Bait Shop.`
		}, {
			name: 'Help',
			value: `\`${prefix}help\`\
				\nReturns this help menu.`
		}, {
			name: 'Cooldown',
			value: `\`${prefix}set <Cooldown>\`, Example: \`${prefix}set 65\`\
				\nAllows you to set a cooldown in minutes for you fishing reminder.`
		}, {
			name: 'Fishing Statistics',
			value: `\`${prefix}stats [User]\`, Examples: \`${prefix}stats\`, \`${prefix}stats @LoadXBare#7156\`\
				\nDisplays lifetime fishing statistics for the specified user (or yourself if no user is specified).`
		}]);

	await msg.reply({ embeds: [helpEmbed] });
};
