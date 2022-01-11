const { Client, Intents } = require('discord.js');
const { handleEvent } = require('./events/handleEvent');
const { token } = require('./private/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

require('./events/handleError')(client);

client.once('ready', async () => { handleEvent('ready', client); });
client.on('messageCreate', async (msg) => { handleEvent('messageCreate', client, msg); });

client.login(token);

/*
TODO: move bait inv evaluation over to evaluate command
TODO: implement best/worst case scenario for bait shop prices using open-sourced data
? command to generate a bait shop
? track statistics of fishing (times fished, fish got, weight got, money got, exp got)
? map statistics to graph which can be sent using command
*/
