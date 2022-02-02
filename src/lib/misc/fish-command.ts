import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';
import { COLORS, PREFIX } from '../../config/constants.js';
import prisma from '../../prisma/client.js';

const sleep = (ms: number) => { return new Promise((resolve) => setTimeout(resolve, ms)); };

const disableFishingReminders = async (message: Message) => {
	await prisma.users.update({
		where: { userId: message.author.id },
		data: { timerEnable: false }
	});
};

const startFishingReminder = async (message: Message): Promise<{ status: string, cooldown: number | null; }> => {
	const user = await prisma.users.upsert({
		where: { userId: message.author.id },
		update: {},
		create: { userId: message.author.id }
	});
	const { userCooldown, timerActive } = user;

	if (userCooldown === -1) return { status: 'cooldown', cooldown: null };
	else if (timerActive) return { status: 'active', cooldown: userCooldown };

	await prisma.users.update({
		where: { userId: message.author.id },
		data: {
			timerActive: true,
			channelId: message.channelId,
			messageId: message.id,
			startTimestamp: Math.ceil(Date.now() / 1000),
			endTimestamp: Math.ceil(Date.now() / 1000) + userCooldown * 60
		}
	});

	return { status: 'started', cooldown: userCooldown };
};

export const handleFishCommand = async (message: Message) => {
	const user = await prisma.users.upsert({
		where: { userId: message.author.id },
		update: {},
		create: { userId: message.author.id }
	});

	if (!user.timerEnable) return;

	const embedBase = new MessageEmbed()
		.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
		.setTitle('Fishing Reminder');

	const promptButtons = new MessageActionRow().addComponents(
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

	const prompt = new MessageEmbed(embedBase)
		.setDescription('Hey! It looks like you just fished!\
		\nWould you like me to start a timer?')
		.setFooter({ text: 'This will timeout in 10 seconds.' })
		.setColor(COLORS.MAIN);

	await sleep((Math.ceil(Math.random() * 3) + 1) * 1000);

	const fishCommandReply = await message.reply({ embeds: [prompt], components: [promptButtons] });

	let interactionType: string;
	let interaction: MessageComponentInteraction;

	const filter = (interaction: MessageComponentInteraction) => interaction.user.id === message.author.id;

	try {
		interaction = await message.channel.awaitMessageComponent({ filter, idle: 10000 });
		interactionType = interaction.customId;
	} catch {
		interactionType = 'Timeout';
	}

	const interactionResponse = new MessageEmbed(embedBase);

	if (interactionType === 'Timeout') {
		interactionResponse
			.setFooter({ text: 'Command timed out.' })
			.setColor(COLORS.TIMEOUT);
		await fishCommandReply.edit({ embeds: [interactionResponse], components: [] });
		return;
	} else if (interactionType === 'Yes') {
		const fishingReminder = await startFishingReminder(message);
		if (fishingReminder.status === 'started') {
			interactionResponse
				.setDescription(`Timer of **${fishingReminder.cooldown} minutes** started successfully!\
				\nI will DM you when your timer is up!`)
				.setColor(COLORS.SUCCESS);
		} else if (fishingReminder.status === 'cooldown') {
			interactionResponse
				.setDescription(`:warning: It looks like you don't have a cooldown set yet!\
				\nYou can set one by typing \`${PREFIX}set <minutes>\`.`)
				.setColor(COLORS.FAIL);
		} else if (fishingReminder.status === 'active') {
			interactionResponse
				.setDescription(`:warning: It looks like you already have an active timer!\
				\nActive timer expires: <t:${user.endTimestamp}:R>`)
				.setColor(COLORS.FAIL);
		}
	} else if (interactionType === 'No') {
		interactionResponse
			.setFooter({ text: 'You selected "No".' })
			.setColor(COLORS.FAIL);
	} else if (interactionType === 'Dont Ask Again') {
		await disableFishingReminders(message);
		interactionResponse
			.setDescription(`**Okay!** I won't ask you again from now on.\
			\n\nIf you change your mind and wish to re-enable them, run \`${PREFIX}enable\`.`)
			.setColor(COLORS.TIMEOUT);
	}

	await fishCommandReply.edit({ embeds: [interactionResponse], components: [] });
};