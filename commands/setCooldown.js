const { embedColourSuccess, embedColourFail } = require('../data/misc.json');
const db = require('../database');

module.exports.setCooldown = async (msg, args) => {
	const cooldown = parseInt(args[0], 10);
	const user = await db.users.fetchUser(msg.author.id);

	const embed = {
		author: { name: msg.author.tag, iconURL: msg.author.avatarURL() },
		title: 'Cooldown'
	};

	if (isNaN(cooldown)) {
		embed.description = `:warning: ${args[0]} is Not a Number!`;
		embed.color = embedColourFail;
		msg.reply({ embeds: [embed] });
		return;
	} else if (cooldown === user.cooldown) {
		embed.description = `:warning: Your cooldown is already set to ${cooldown} minutes!`;
		embed.color = embedColourFail;
		msg.reply({ embeds: [embed] });
		return;
	}

	await db.users.updateUser(msg.author.id, 'cooldown', cooldown);

	embed.description = `Successfully set your cooldown to **${cooldown} minutes**!\
	\n\n***NOTE:*** *This does not start a timer! If you wish to start a timer, run the fish command and select "Yes" on the prompt that pops up.*`;
	embed.color = embedColourSuccess;

	msg.reply({ embeds: [embed] });
};