import { Message, MessageEmbed } from 'discord.js';
import { COLORS, PREFIX } from '../config/constants';

export const help = async (message: Message): Promise<void> => {
	const help = new MessageEmbed()
		.setTitle('__Bot Info__')
		.setColor(COLORS.MAIN)
		.setFields([{
			name: 'PREFIX',
			value: 'My PREFIX is `,`!'
		}, {
			name: 'Command Arguments',
			value: 'Arguments surrounded with `< >` are **required**,\narguments surrounded with `[ ]` are **optional**.'
		}, {
			name: 'Help',
			value: `\`${PREFIX}help\`\
				\nReturns this help menu.`
		}, {
			name: 'Cooldown',
			value: `\`${PREFIX}set <Cooldown>\`, Example: \`${PREFIX}set 65\`\
				\nAllows you to set a cooldown in minutes for you fishing reminder.`
		}, {
			name: 'Fishing Statistics',
			value: `\`${PREFIX}stats [User]\`, Examples: \`${PREFIX}stats\`, \`${PREFIX}stats @LoadXBare#7156\`\
				\nDisplays lifetime fishing statistics for the specified user (or yourself if no user is specified).`
		}]);

	await message.reply({ embeds: [help] });
};