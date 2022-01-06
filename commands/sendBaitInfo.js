const baitData = require('../data/bait.json');
const { embedColour, embedColourFail } = require('../data/misc.json');

module.exports.sendBaitInfo = async (msg, args) => {
	let embed;
	let baitName;

		// Capitalise first letter of each word in bait name
		if (args[1] === 'cutbait') { baitName = `${args[0].charAt(0).toUpperCase() + args[0].slice(1)}_${args[1].charAt(0).toUpperCase() + args[1].slice(1)}`; }
		else { baitName = `${args[0].charAt(0).toUpperCase() + args[0].slice(1)}`; }

		try {
			embed = {
				title: `${baitName.replace('_', ' ')} [${baitData[baitName.toLowerCase()].rating}]`,
				description: baitData[baitName.toLowerCase()].description,
				color: embedColour,
				thumbnail: { url: baitData[baitName.toLowerCase()].imageURL }
			};
		} catch {
			embed = {
				description: `:warning: \`${baitName}\` is not a valid bait!`,
				color: embedColourFail
			};
		}

		msg.reply({ embeds: [embed] });
};
