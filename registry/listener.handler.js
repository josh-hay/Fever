const fs = require('fs').promises;
const path = require('path');

async function register(client) {
    let dir = '../listeners'
    let files = await fs.readdir(path.join(__dirname, dir));
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory())
            registerListeners(client, path.join(dir, file));
        else {
            if(file.endsWith(".js")) {
                let eventName = file.substring(0, file.indexOf(".js"));
                try {
                    let eventModule = require(path.join(__dirname, dir, file));
                    client.on(eventName, eventModule.bind(null, client));
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    }
}

module.exports = {
    register
}