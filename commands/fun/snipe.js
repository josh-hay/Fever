const { MessageEmbed } = require("discord.js");

module.exports = {
  description: "Snipes the last deleted message.",
  commands: ["snipe"],
  expectedArgs: "",
  minArgs: 0,
  maxArgs: null,
  cooldown: 5,
  permissions: [],
  requiredRoles: [],
  noPermission: "You do not have permission to run this command.",
  execute: async (client, message, args, text) => {
    
    const msg = client.snipes.get(message.channel.id);

    if(!msg) return;

    const embed = new MessageEmbed()
      .setColor(`#000`)
      .setAuthor(msg.author, msg.member.user.displayAvatarURL())
      .setDescription(msg.content)
      .setFooter(`gotcha | suicide.lol`)
      .setTimestamp(msg.timestamp);

    return await message.channel.send(embed);
  },
};
