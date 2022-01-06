const { prefix, embedColour } = require('../data/misc.json');

module.exports.sendHelpInfo = async (msg) => {
	const embed = {
		title: '__Bot Info__',
		color: embedColour,
		fields: [{
			name: 'Prefix',
			value: 'My prefix is `,`!'
		},
		{
			name: 'Bait Info',
			value: `\`${prefix}bi <Bait Name>\`, Example: \`${prefix}bi large cutbait\`\
			\nReturns information related to the bait of your choosing.`
		},
		{
			name: 'Evaluate Bait Shop',
			value: `\`${prefix}evalbs\`\
			\nReturns statistics related to Big Tuna's current Bait Shop.`
		},
		{
			name: 'Help',
			value: `\`${prefix}help\`\
			\nReturns this help menu.`
		},
		{
			name: 'Uptime',
			value: `\`${prefix}uptime\`\
			\nReturns the bot's current uptime in Days, Hours, Minutes & Seconds.`
		}]
	};

	msg.reply({ embeds: [embed] });
};
