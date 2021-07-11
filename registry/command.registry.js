const fs = require("fs").promises;
const path = require("path");
const commandBase = require("../commands/command-base");

async function initCommands(client, dir) {
  let files = await fs.readdir(path.join(__dirname, dir));
  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory()) {
      initCommands(client, path.join(dir, file));
    }
    else if (file !== commandBase) {
      const options = require(path.join(__dirname, dir, file));
      commandBase(client, options);
    }
  }
}

module.exports = async (client) => {
    initCommands(client, '../commands');
}