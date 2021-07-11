const { MessageEmbed } = require("discord.js");

async function getResponse(authorId, creatorMessage, query, callback) {

  const creatorEmbed = new MessageEmbed()
  .setTitle(`Embed Creator`)
  .setColor(`#fffffc`)
  .setDescription(`Enter the ${query}: (type \`skip\` to skip or \`cancel\` to cancel)`);

  const cancelCreatorEmbed = new MessageEmbed()
  .setTitle(`Embed Creator`)
  .setColor(`#fffffc`)
  .setDescription(`Cancelling...`);

  creatorMessage.edit(creatorEmbed).then(async () => {
    creatorMessage.channel.awaitMessages((m) => m.author.id === authorId, { max: 1, time: 30000, errors: ['time']}).then(async (collected) => {
      let response = collected.first().content;
      if(response === 'cancel') {
        await collected.first().delete();
        await creatorMessage.edit(cancelCreatorEmbed).then(async msg => {
          return await msg.delete({timeout: 2000});
        });
      } else if(response === 'skip') {
        await collected.first().delete();
        await callback(creatorMessage, null);
      } else {
        await collected.first().delete();
        await callback(creatorMessage, response);
      }
    }).catch(async (err) => {
        await creatorMessage.edit(cancelCreatorEmbed).then(async msg => {
          return await msg.delete({timeout: 2000});
        });
    });
  });
}

module.exports = {
  description: "Create an embed",
  commands: ["embed"],
  expectedArgs: "",
  minArgs: 0,
  maxArgs: null,
  cooldown: 0,
  permissions: ['MANAGE_GUILD'],
  requiredRoles: [],
  noPermission: "You do not have permission to run this command.",
  execute: async (client, message, args, text) => {

    const embed = new MessageEmbed();

    const { author } = message;

    message.delete();

    const creatorEmbed = new MessageEmbed()
      .setTitle(`Embed Creator`)
      .setColor(`#00000f`)
      .setDescription(`Loading...`);

    await message.channel.send(creatorEmbed).then(async(next) => {

      await getResponse(author.id, next, 'title', async (creatorMessage, response) => {
        if(response) embed.setTitle(response);
        await getResponse(author.id, next, 'description', async (creatorMessage, response) => {
          if(response) embed.setDescription(response);
          await getResponse(author.id, next, 'color', async (creatorMessage, response) => {
            if(response) embed.setColor(response);
            await getResponse(author.id, next, 'image', async (creatorMessage, response) => {
              if(response) embed.setImage(response);
              await getResponse(author.id, next, 'thumbnail', async (creatorMessage, response) => {
                if(response) embed.setThumbnail(response);
                await getResponse(author.id, next, 'emojis you want to add', async (creatorMessage, response) => {
                  if(response) {
                    creatorMessage.delete();
                    let embedMessage = await message.channel.send(embed);
                    let emojis = response.split(" ");
                    for(let emoji in emojis) {
                      await embedMessage.react(emojis[emoji]);
                    }
                  } else {
                    creatorMessage.delete();
                    return await message.channel.send(embed);
                  }
                });
              });
            });
          });
        });
      });
    });
  },
};
