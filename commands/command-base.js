const prefix = process.env.DEFAULT_PREFIX;

const { table } = require("table");
const humanizeDuration = require('humanize-duration');

const { Collection } = require('discord.js');

const validatePermissions = (permissions) => {
  const valid = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ];

  for (const permission of permissions) {
    if (!valid.includes(permission)) {
      throw new Error(`Unknown permission: ${permission}`);
    }
  }
};

module.exports = (client, options) => {

  let {
    commands,
    cooldown = 0,
    description = "",
    expectedArgs = "",
    noPermission = "You do not have permission to use this command.",
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    requiredRoles = [],
    execute,
  } = options;

  if (!commands) return;

  if (typeof commands === "string") {
    commands = [commands];
  }

  console.log(table([[`Registered command: ${commands[0]}`]]));

  if (permissions.length) {
    if (typeof permissions === "string") {
      permissions = [permissions];
    }
    validatePermissions(permissions);
  }

  client.on("message", (message) => {
    const { member, content, guild } = message;
    for (const alias of commands) {
      if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
        
        
        for (const permission in permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(noPermission);
            return;
          }
        }

        for (const requiredRole in requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          );
          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `You must have the ${requiredRole} role to use this command.`
            );
            return;
          }
        }

        const args = content.split(/[ ]+/);

        args.shift();

        if (
          args.length < minArgs ||
          (maxArgs !== null && args.length > maxArgs)
        ) {
          message.reply(
            `Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`
          );
          return;
        }

        if(!client.cooldowns.has(commands[0])) {
          client.cooldowns.set(commands[0], new Collection());
        }
        if(!client.hideCooldowns.has(commands[0])) {
          client.hideCooldowns.set(commands[0], new Collection());
        }

        const now = Date.now();
        const timestamps = client.cooldowns.get(commands[0]);
        const cd = (cooldown || 0) * 1000;

        const hideCooldowns = client.hideCooldowns.get(commands[0]);

        if(timestamps.has(message.author.id)) {
          const expiry = timestamps.get(message.author.id) + cd;
          if(now < expiry) {
              if(!hideCooldowns.has(message.author.id)) {
                const remaining = humanizeDuration((expiry - now) / 1000 * 1000, {round: true});
                message.reply(`Please wait ${remaining} before using the ${commands[0]} command again.`);
                hideCooldowns.set(message.author.id, true);
              } else {
                message.delete();
              }
            return;
          }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => {
          timestamps.delete(message.author.id); 
          hideCooldowns.delete(message.author.id);
        }, cd);

        execute(client, message, args, args.join(" "));

        return;
      }
    }
  });
};
