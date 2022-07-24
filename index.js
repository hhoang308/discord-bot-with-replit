// *IMPORTANT* Read the Readme or go to the Markdown tab next to the shell. (There are a few steps you need to do before running this)

console.log("NodeJS Version: " + process.version)

const { Discord, Client, Collection, MessageEmbed, Intents} = require('discord.js');
const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_INVITES'] });

client.on('ready', () => {
  console.log(`${client.user.tag} is online!`)
})



client.login(process.env.TOKEN)