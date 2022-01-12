const { embedColour } = require('../data/misc.json');

module.exports.sendUptime = async (msg, client) => {
	const uptimeSecs = Math.floor(client.uptime / 1000);
	const botUptime = {
		secs: uptimeSecs % 60,
		mins: Math.floor(uptimeSecs / 60) % 60,
		hours: Math.floor(uptimeSecs / 3600) % 24,
		days: Math.floor(uptimeSecs / 86400)
	};

	const embed = {
		color: embedColour,
		fields: [{
			name: 'Uptime',
			value: `I have been online for **${botUptime.days} days, ${botUptime.hours} hours, ${botUptime.mins} minutes, ${botUptime.secs} seconds**!`
		}]
	};

	msg.reply({ embeds: [embed] });
};
