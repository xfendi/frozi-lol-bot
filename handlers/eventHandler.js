const fs = require("node:fs");
const path = require("node:path");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "../events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    client.on(event.name, (...args) => event.execute(client, ...args));
    console.log(`[EVENT HANDLER]: Loaded event: ${event.name}`);
  }
};
