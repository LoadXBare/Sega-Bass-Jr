const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { prefix, embedColour, embedColourSuccess, embedColourFail, embedColourTimeout } = require('../data/misc.json');
const prisma = require('../prisma/client.js');

const sleep = (ms) => { return new Promise((resolve) => setTimeout(resolve, ms)); };

const disableFishTimer = async (msg) => {
	await prisma.users.update({ where: { userId: msg.author.id }, data: { timerEnable: false } });
};

const startFishTimer = async (msg) => {
	const user = await prisma.users.upsert({ where: { userId: msg.author.id }, update: {}, create: { userId: msg.author.id } });

	const embedBase = new MessageEmbed()
		.setAuthor({ name: msg.author.tag, iconURL: msg.author.avatarURL() })
		.setTitle('Fishing Reminder');

	if (user.userCooldown === -1) { return { status: 'cooldown', cooldown: null }; }
	if (user.timerActive) { return { status: 'active', cooldown: user.userCooldown }; }

	await prisma.users.update({ where: { userId: msg.author.id }, data: { timerActive: true, startedTimestamp: (Date.now()).toString() } });

	setTimeout(async () => {
		await prisma.users.update({ where: { userId: msg.author.id }, data: { timerActive: false } });

		const reminderEmbed = new MessageEmbed(embedBase)
			.setDescription(`**Hey!** ${user.userCooldown} minutes have passed!\
			\n\n**GO FISH!** 🎣`)
			.setColor(embedColour);

		try { await msg.author.send({ embeds: [reminderEmbed] }); }
		catch { await msg.reply({ content: 'I had some trouble reaching your DMs. Regardless, here is your reminder!', embeds: [reminderEmbed] }); }
	}, user.userCooldown * 1000 * 60);
	return { status: 'started', cooldown: user.userCooldown };
};

module.exports.onFishCommand = async (msg) => {
	const rand = Math.random().toString(16).slice(2, 12);
	const user = await prisma.users.upsert({ where: { userId: msg.author.id }, update: {}, create: { userId: msg.author.id } });

	if (user.timerEnable === false) { return; }

	await sleep(Math.ceil(Math.random() * 3) + 1);

	const embedBase = new MessageEmbed()
		.setAuthor({ name: msg.author.tag, iconURL: msg.author.avatarURL() })
		.setTitle('Fishing Reminder');

	const promptButtons = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId(`${rand}-Yes`)
			.setLabel('Yes')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId(`${rand}-No`)
			.setLabel('No')
			.setStyle('DANGER'),
		new MessageButton()
			.setCustomId(`${rand}-Dont Ask Again`)
			.setLabel('Don\'t Ask Again')
			.setStyle('SECONDARY')
	);

	const promptEmbed = new MessageEmbed(embedBase)
		.setDescription('Hey! It looks like you just fished!\
		\nWould you like me to start a timer?')
		.setFooter({ text: 'This will timeout in 10 seconds.' })
		.setColor(embedColour);

	const cmdReply = await msg.reply({ embeds: [promptEmbed], components: [promptButtons] });

	const filter = (interaction) => interaction.customId.includes(rand) && interaction.user.id === msg.author.id;

	let interactionType = '';
	let interaction;

	try { interaction = await msg.channel.awaitMessageComponent({ filter, time: 10000 }); }
	catch (err) { interactionType = 'time'; }

	if (interactionType === 'time') {
		const timeoutEmbed = new MessageEmbed(embedBase)
			.setFooter({ text: 'Command timed out.' })
			.setColor(embedColourTimeout);
		await cmdReply.edit({ embeds: [timeoutEmbed], components: [] });
		return;
	} else { interactionType = interaction.customId.slice(interaction.customId.search(/-/g) + 1); }

	const interactionResponseEmbed = new MessageEmbed(embedBase);

	if (interactionType === 'Yes') {
		const timer = await startFishTimer(msg);
		if (timer.status === 'started') {
			interactionResponseEmbed
				.setDescription(`Timer of **${timer.cooldown} minutes** started successfully!\
				\nI will DM you when your timer is up!`)
				.setColor(embedColourSuccess);
		} else if (timer.status === 'cooldown') {
			interactionResponseEmbed
				.setDescription(`:warning: It looks like you don't have a cooldown set yet!\
				\nYou can set one by typing \`${prefix}set <minutes>\`.`)
				.setColor(embedColourFail);
		} else if (timer.status === 'active') {
			interactionResponseEmbed
				.setDescription(`:warning: It looks like you already have an active timer!\
				\nActive timer expires: <t:${Math.ceil((timer.cooldown * 60) + (user.startedTimestamp / 1000))}:R>`)
				.setColor(embedColourFail);
		}
	} else if (interactionType === 'No') {
		interactionResponseEmbed
			.setFooter({ text: 'You selected "No".' })
			.setColor(embedColourFail);
	} else if (interactionType === 'Dont Ask Again') {
		await disableFishTimer(msg);
		interactionResponseEmbed
			.setDescription(`**Okay!** I won't ask you again from now on.\
			\n\nIf you change your mind and wish to re-enable them, run \`${prefix}enable\`.`)
			.setColor(embedColourTimeout);
	}

	await cmdReply.edit({ embeds: [interactionResponseEmbed], components: [] });
};
