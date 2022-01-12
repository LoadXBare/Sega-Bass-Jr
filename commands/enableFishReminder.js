const { embedColourSuccess } = require('../data/misc.json');
const db = require('../database');

module.exports.enableFishReminder = async (msg) => {
	await db.users.updateUser(msg.author.id, 'remindersEnabled', true);

	const embed = {
		author: {
			name: msg.author.tag,
			iconURL: msg.author.avatarURL()
		},
		title: 'Fishing Reminders',
		description: 'Successfully enabled fishing reminders!',
		footer: { text: 'You will see a prompt next time you run the fish command.' },
		color: embedColourSuccess
	};

	msg.reply({ embeds: [embed] });
	return;
};