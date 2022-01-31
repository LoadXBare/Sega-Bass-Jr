const { Client, Intents } = require('discord.js');
const { handleEvent } = require('./events/handleEvent');
const { token } = require('./private/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', async () => { handleEvent('ready', { client: client }); });
client.on('messageCreate', async (msg) => { handleEvent('messageCreate', { msg: msg }); });
client.on('messageUpdate', async (msgBefore, msgAfter) => { handleEvent('messageUpdate', { client: client, msgBefore: msgBefore, msgAfter: msgAfter }); });

client.login(token);

/*
 • Map statistics to graph which can be sent using command
*/
