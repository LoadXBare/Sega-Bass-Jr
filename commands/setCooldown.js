const { embedColourSuccess, embedColourFail } = require('../data/misc.json');
const { MessageEmbed } = require('discord.js');
const prisma = require('../prisma/client.js');

module.exports.setCooldown = async (msg, args) => {
	const cooldown = parseInt(args[0], 10);
	const embedBase = new MessageEmbed()
		.setAuthor({ name: msg.author.tag, iconURL: msg.author.avatarURL() })
		.setTitle('Cooldown');

	if (isNaN(cooldown)) {
		const errorEmbed = new MessageEmbed(embedBase)
			.setDescription(`:warning: ${args[0]} is Not a Number!`)
			.setColor(embedColourFail);

		await msg.reply({ embeds: [errorEmbed] });
		return;
	}

	await prisma.users.upsert({
		where: { userId: msg.author.id },
		update: { userCooldown: cooldown },
		create: { userId: msg.author.id, userCooldown: cooldown }
	});

	const cooldownSetEmbed = new MessageEmbed(embedBase)
		.setDescription(`Successfully set your cooldown to **${cooldown} minutes**!\
		\n\n***NOTE:*** *This does not start a timer! If you wish to start a timer, run the fish command and select "Yes" on the prompt that pops up.*`)
		.setColor(embedColourSuccess);

	await msg.reply({ embeds: [cooldownSetEmbed] });
};
