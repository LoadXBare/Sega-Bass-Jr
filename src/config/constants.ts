import { bold } from '@discordjs/builders';
import { ColorResolvable, Intents } from 'discord.js';

export const PREFIX = ',';
export const INTENTS = new Intents([
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]);
export const EVENTS = [
	'ready',
	'messageCreate',
	'messageUpdate'
];
export const COLORS = {
	MAIN: 'BLUE' as ColorResolvable,
	TIMEOUT: 'DARKER_GREY' as ColorResolvable,
	SUCCESS: 'GREEN' as ColorResolvable,
	FAIL: 'RED' as ColorResolvable
};
export const BAITS = {
	BLOODWORMS: {
		VALUE: 1.50,
		RATING: '⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('A')}\
		\n• Catches exclusively: ${bold('small')} fish\
		\n• More likely to catch: ${bold('panfish')}`
	},
	BREAD: {
		VALUE: 1.25,
		RATING: '⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('C')}\
		\n• Catches exclusively: ${bold('small')} fish\
		\n• More likely to catch: ${bold('minnow')}`
	},
	CANDYCANE: {
		VALUE: 40,
		RATING: '⭐⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('SS')}\
		\n• Exclusive to events`
	},
	CORN: {
		VALUE: 1,
		RATING: '⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('C')}`
	},
	CRAB: {
		VALUE: 6,
		RATING: '⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('B')}\
		\n• Catches exclusively: ${bold('large')} & ${bold('extra large')} fish`
	},
	CRAYFISH: {
		VALUE: 4.50,
		RATING: '⭐⭐',
		DESCRIPTION: `• Catches exclusively: ${bold('large')} & ${bold('extra large')} fish`
	},
	CRICKETS: {
		VALUE: 2,
		RATING: '⭐',
		DESCRIPTION: `• Catches exclusively: ${bold('medium')} fish`
	},
	DRAGONFLY: {
		VALUE: 5,
		RATING: '⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('C')}\
		\n• Catches exclusively: ${bold('large')}, ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('carp')}`
	},
	HUGECUTBAIT: {
		VALUE: 35,
		RATING: '⭐⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('S')}\
		\n• Catches exclusively: ${bold('extra large')} fish`
	},
	LARGECUTBAIT: {
		VALUE: 12,
		RATING: '⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('S')}\
		\n• Catches exclusively: ${bold('large')} & ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('sturgeon')}`
	},
	LEECHES: {
		VALUE: 3,
		RATING: '⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('B')}\
		\n• Catches exclusively: ${bold('medium')}, ${bold('large')} & ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('perch')}`
	},
	LIVER: {
		VALUE: 9,
		RATING: '⭐⭐',
		DESCRIPTION: `• Catches exclusively: ${bold('extra large')} fish`
	},
	MAGGOTS: {
		VALUE: 2.25,
		RATING: '⭐⭐',
		DESCRIPTION: `• Catches exclusively: ${bold('medium')}, ${bold('large')} & ${bold('extra large')} fish`
	},
	MEAT: {
		VALUE: 2,
		RATING: '⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('A')}`
	},
	MEDIUMCUTBAIT: {
		VALUE: 7,
		RATING: '⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('S')}\
		\n• Catches exclusively: ${bold('medium')}, ${bold('large')} & ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('gar')}`
	},
	MINNOWS: {
		VALUE: 1,
		RATING: '⭐',
		DESCRIPTION: `• Catches exclusively ${bold('small')}, ${bold('medium')} & ${bold('large')} fish\
		\n• More likely to catch: ${bold('trout')} & ${bold('crappie')}`
	},
	PEAS: {
		VALUE: 1,
		RATING: '⭐',
		DESCRIPTION: `• Catches exclusively: ${bold('small')} fish`
	},
	SARDINE: {
		VALUE: 2.50,
		RATING: '⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('B')}\
		\n• Catches exclusively ${bold('medium')} & ${bold('large')} fish\
		\n• More likely to catch: ${bold('bass')}`
	},
	SHRIMP: {
		VALUE: 4,
		RATING: '⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('A')}\
		\n• Catches exclusively: ${bold('medium')}, ${bold('large')} & ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('catfish')} & ${bold('pike')}`
	},
	SMALLCUTBAIT: {
		VALUE: 4.50,
		RATING: '⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('S')}\
		\n• More likely to catch: ${bold('catfish')}`
	},
	TUNACHUNKS: {
		VALUE: 25,
		RATING: '⭐⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('A')}\
		\n• Catches exclusively: ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('shark')}`
	},
	TUNAHEAD: {
		VALUE: 18,
		RATING: '⭐⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('B')}\
		\n• Catches exclusively: ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('catfish')}`
	},
	TUNATAIL: {
		VALUE: 12,
		RATING: '⭐⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('C')}\
		\n• Catches exclusively: ${bold('extra large')} fish\
		\n• More likely to catch: ${bold('sturgeon')}`
	},
	WAGYU: {
		VALUE: 18,
		RATING: '⭐⭐⭐⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('C')}\
		\n• Catches exclusively: ${bold('extra large')} fish\
		\n• Temporarily increase max weight by: ${bold('50%')}`
	},
	WORMS: {
		VALUE: 1.50,
		RATING: '⭐',
		DESCRIPTION: `• Minimum fish tier: ${bold('B')}`
	}
};