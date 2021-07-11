const { table } = require("table");

module.exports = async (client) => {
  console.log(
    table([
      [`Bot: ${client.user.username}#${client.user.discriminator}`],
      [`Status: Ready ✅`],
    ])
  );

  await require("../registry/command.registry")(client);
  await require("../utilities/status-changer")(client);
};
