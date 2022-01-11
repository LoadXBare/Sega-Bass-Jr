/* eslint-disable no-undef */
/* eslint-disable no-console */
const { errorChannel } = require('../private/config.json');

module.exports = (client) => {
	const d = new Date();
	const dFormatted = `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} at ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

	let embed = {
		title: '⚠️ New Error',
		color: 'RED',
		timestamp: d
	};

	process.on('unhandledRejection', (reason) => {
		embed.description = `**An error just occurred!**\
		\n\n[unhandledRejection]\
		\n\n\`\`\`${reason}\`\`\``;

		console.log('[!] [!] [!] [!] [!] [!] [!] [!] [!] [!]');
		console.log(`An error just occurred! [${dFormatted}]\n`);
		console.log(reason);
		console.log('[!] [!] [!] [!] [!] [!] [!] [!] [!] [!]');

		client.channels.cache.get(errorChannel).send({ embeds: [embed] });
	});

	process.on('uncaughtException', (err) => {
		embed.description = `**An error just occurred!**\
		\n\n[uncaughtException]\
		\n\n\`\`\`${err}\`\`\``;

		console.log('[!] [!] [!] [!] [!] [!] [!] [!] [!] [!]');
		console.log(`An error just occurred! [${dFormatted}]`);
		console.log(err);
		console.log('[!] [!] [!] [!] [!] [!] [!] [!] [!] [!]');

		client.channels.cache.get(errorChannel).send({ embeds: [embed] });
	});

	process.on('multipleResolves', (type, promise, reason) => {
		embed.description = `**An error just occurred!**\
		\n\n[multipleResolves]\
		\n\n\`\`\`${type}\n\n${promise}\n\n${reason}\`\`\``;

		console.log('[!] [!] [!] [!] [!] [!] [!] [!] [!] [!]');
		console.log(`An error just occurred! [${dFormatted}]`);
		console.log(type, promise, reason);
		console.log('[!] [!] [!] [!] [!] [!] [!] [!] [!] [!]');

		client.channels.cache.get(errorChannel).send({ embeds: [embed] });
	});

};