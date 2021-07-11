require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

require('discord-buttons')(client);

(async () => {
    client.login(process.env.BOT_TOKEN);
    client.cooldowns = new Discord.Collection(),
      client.snipes = new Discord.Collection(),
      client.hideCooldowns = new Discord.Collection();
    await a();
    await require('./registry/listener.handler').register(client);
    client.setMaxListeners(0);
})();

async function a() {
    console.log(`
  ██████  █    ██   ██▓  ▄████▄   ██▓▓█████▄  ▓█████
▒██    ▒  ██  ▓██▒▒▓██▒ ▒██▀ ▀█ ▒▓██▒▒██▀ ██▌ ▓█   ▀
░ ▓██▄   ▓██  ▒██░▒▒██▒ ▒▓█    ▄▒▒██▒░██   █▌ ▒███  
  ▒   ██▒▓▓█  ░██░░░██░▒▒▓▓▄ ▄██░░██░░▓█▄   ▌ ▒▓█  ▄
▒██████▒▒▒▒█████▓ ░░██░░▒ ▓███▀ ░░██░░▒████▓ ▒░▒████
▒ ▒▓▒ ▒ ░░▒▓▒ ▒ ▒  ░▓  ░░ ░▒ ▒   ░▓   ▒▒▓  ▒ ░░░ ▒░ 
░ ░▒  ░ ░░░▒░ ░ ░ ░ ▒ ░   ░  ▒  ░ ▒ ░ ░ ▒  ▒ ░ ░ ░  
░  ░  ░   ░░░ ░ ░ ░ ▒ ░ ░       ░ ▒ ░ ░ ░  ░     ░  
      ░     ░       ░   ░ ░       ░     ░    ░   ░  
`);
}