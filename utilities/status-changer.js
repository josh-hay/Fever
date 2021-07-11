module.exports = async (client) => {
    let activities = [
        {
          status: "online",
          activity: {
            name: "suicide.lol",
            type: "WATCHING",
          },
        },
        {
          status: "online",
          activity: {
            name:
              client.guilds.cache.size +
              ` server${client.guilds.cache.size > 1 ? "s" : ""}.`,
            type: "WATCHING",
          },
        },
        {
          status: "online",
          activity: {
            name: "with a noose.",
            type: "PLAYING",
          },
        },
      ];
    
      let index = 0;
      setInterval(() => {
        if (index == activities.length) index = 0;
        client.user.setPresence(activities[index]);
        index++;
      }, 5000);
}