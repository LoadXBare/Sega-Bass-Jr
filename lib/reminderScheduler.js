const { MessageEmbed } = require('discord.js');
const { embedColour } = require('../data/misc.json');
const prisma = require('../prisma/client.js');

const sendReminder = async (client, user) => {
	await prisma.users.update({ where: { userId: user.userId }, data: { timerActive: false } });

	const discordUser = await client.users.fetch(user.userId);
	const fishChannel = await client.channels.fetch(user.channelId);
	const fishMessage = await fishChannel.messages.fetch(user.messageId);

	const reminderEmbed = new MessageEmbed()
		.setDescription(`**Hey!** ${user.userCooldown} minutes have passed!\
			\n\n**GO FISH!** 🎣`)
		.setColor(embedColour);

	try { await discordUser.send({ embeds: [reminderEmbed] }); }
	catch { await fishMessage.reply({ content: 'I had some trouble reaching your DMs. Regardless, here is your reminder!', embeds: [reminderEmbed] }); }
};

module.exports = async (client) => {
	setInterval(async () => {
		const users = await prisma.users.findMany({
			select: { userId: true, endTimestamp: true, channelId: true, messageId: true, userCooldown: true },
			where: { timerActive: { equals: true } }
		});

		users.every(async (user) => {
			if (user.endTimestamp <= Math.ceil(Date.now() / 1000)) {
				await sendReminder(client, user);
			}
		});
	}, 10000);
};
