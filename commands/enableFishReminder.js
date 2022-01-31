const { embedColourSuccess } = require('../data/misc.json');
const prisma = require('../prisma/client.js');
const { MessageEmbed } = require('discord.js');

module.exports.enableFishReminder = async (msg) => {
	await prisma.users.upsert({
		where: { userId: msg.author.id },
		update: { timerEnable: true },
		create: { userId: msg.author.id }
	});

	const remindersEnabledEmbed = new MessageEmbed()
		.setAuthor({ name: msg.author.tag, iconURL: msg.author.avatarURL() })
		.setTitle('Fishing Reminders')
		.setDescription('Successfully enabled fishing reminders!')
		.setFooter({ text: 'You will see a prompt next time you run the fish command.' })
		.setColor(embedColourSuccess);

	await msg.reply({ embeds: [remindersEnabledEmbed] });
};
