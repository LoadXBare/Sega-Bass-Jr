const { MessageActionRow, MessageButton } = require("discord.js");
const { prefix, embedColour, embedColourSuccess, embedColourFail, embedColourTimeout } = require('../data/misc.json');
const db = require('../database');
const { logChannel } = require('../private/config.json');

const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };

module.exports.onFishCommand = async (msg) => {
	let user = await db.users.fetchUser(msg.author.id);
	if (user.remindersEnabled === 0) { return; }

	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('Yes')
			.setLabel('Yes')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('No')
			.setLabel('No')
			.setStyle('DANGER'),
		new MessageButton()
			.setCustomId('Dont Ask Again')
			.setLabel('Don\'t Ask Again')
			.setStyle('SECONDARY')
	);

	let embed = {
		author: {
			name: msg.author.tag,
			iconURL: msg.author.avatarURL()
		},
		title: 'Fish Reminder',
		description: `Hey! It looks like you just fished!\
		\nWould you like me to start a timer?`,
		footer: { text: 'This will timeout in 10 seconds.' },
		color: embedColour
	};

	await sleep(2000);

	const cmdReply = await msg.reply({ embeds: [embed], components: [row] });

	const collector = msg.channel.createMessageComponentCollector({ time: 10000 });

	collector.on('collect', async (i) => {
		if (i.user.id !== msg.author.id) { return i.reply({ content: `<@${i.user.id}> This button is not for you!`, ephemeral: true }); }
		else if (i.message.id !== cmdReply.id) { return i.reply({ content: `<@${i.user.id}> This button belongs to a different message!`, ephemeral: true }); }
		collector.stop();

		if (i.customId === 'Yes') {
			let timer = await startFishTimer(msg);
			if (timer.reason === 'started') {
				embed.description = `Timer of **${timer.cooldown} minutes** started successfully!\
				\nI will DM you when your timer is up!`;
				embed.color = embedColourSuccess;
			} else if (timer.reason === 'cooldown') {
				embed.description = `:warning: It looks like you don't have a cooldown set yet!\
				\nYou can set one by typing \`${prefix}set <minutes>\`.`;
				embed.color = embedColourFail;
			} else if (timer.reason === 'active') {
				embed.description = ':warning: It looks like you already have an active timer!';
				embed.color = embedColourFail;
			}
			embed.footer = null;
		} else if (i.customId === 'Dont Ask Again') {
			await disableFishTimer(msg);
			embed.description = `**Okay!** I won't ask you again from now on.\
			\n\nIf you change your mind and wish to re-enable them, run \`${prefix}enable\`.`;
			embed.color = embedColourTimeout;
			embed.footer = null;
		} else if (i.customId === 'No') {
			embed.color = embedColourFail;
			embed.footer = { text: 'You selected "No".'};
		}

		return cmdReply.edit({ embeds: [embed], components: [] });
	});

	collector.on('end', async (collected, reason) => {
		if (reason === 'time') {
			embed.color = embedColourTimeout;
			embed.footer = { text: 'Command timed out.' };
			return cmdReply.edit({ embeds: [embed], components: [] });
		}
	});
};

const disableFishTimer = async (msg) => {
	await db.users.updateUser(msg.author.id, 'remindersEnabled', false);
	return;
};

const startFishTimer = async (msg) => {
	let user = await db.users.fetchUser(msg.author.id, msg.client);
	let embed = {
		author: {
			name: msg.author.tag,
			iconURL: msg.author.avatarURL()
		},
		title: 'Fish Reminder'
	};

	if (user.cooldown === null) { return { reason:'cooldown', cooldown: null}; }
	if (user.timerActive) { return { reason:'active', cooldown: null }; }

	await db.users.updateUser(msg.author.id, 'timerActive', true);

	const logEmbed = {
		title: 'ℹ️ New Log',
		description: `Started Fishing Reminder Timer for \`${msg.author.tag}\``,
		color: 'BLUE',
		timestamp: Date.now()
	};
	await msg.client.channels.cache.get(logChannel).send({ embeds: [logEmbed] });

	setTimeout(async () => {
		logEmbed.description = `Successfully sent Fishing Reminder to \`${msg.author.tag}\``;
		logEmbed.color = 'GREEN';

		await db.users.updateUser(msg.author.id, 'timerActive', false);
		embed.description = `**Hey!** ${user.cooldown} minutes have passed!\
		\n\n**GO FISH!** 🎣`;
		embed.color = embedColour;
		try { await msg.author.send({ embeds: [embed] }); }
		catch { await msg.reply({ content: 'I had some trouble reaching your DMs. Regardless, here is your reminder!', embeds: [embed] }); }
		finally { await msg.client.channels.cache.get(logChannel).send({ embeds: [logEmbed] }); }
	}, user.cooldown * 1000 * 60);
	return { reason: 'started', cooldown: user.cooldown };
};