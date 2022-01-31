/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js');
const { errorChannel } = require('../private/config.json');

module.exports = async (client) => {
	const embedBase = new MessageEmbed()
		.setTitle(':warning: New Error')
		.setColor('RED');
	const errChnl = await client.channels.fetch(errorChannel);

	process.on('unhandledRejection', async (reason) => {
		const errorEmbed = new MessageEmbed(embedBase)
			.setDescription(`**An error just occurred!**\
			\n\n[unhandledRejection]\
			\n\n\`\`\`${reason}\`\`\``)
			.setTimestamp(Date.now());

		await errChnl.send({ embeds: [errorEmbed] });
	});

	process.on('uncaughtException', async (err) => {
		const errorEmbed = new MessageEmbed(embedBase)
			.setDescription(`**An error just occurred!**\
			\n\n[uncaughtException]\
			\n\n\`\`\`${err}\`\`\``)
			.setTimestamp(Date.now());

		await errChnl.send({ embeds: [errorEmbed] });
	});

	process.on('multipleResolves', async (type, promise, reason) => {
		const errorEmbed = new MessageEmbed(embedBase)
			.setDescription(`**An error just occurred!**\
			\n\n[multipleResolves]\
			\n\n\`\`\`${type}\n\n${promise}\n\n${reason}\`\`\``)
			.setTimestamp(Date.now());

		await errChnl.send({ embeds: [errorEmbed] });
	});

};
