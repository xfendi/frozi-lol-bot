const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.commands = new Map();

  const commandsPath = path.join(__dirname, "../commands");
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.join(folderPath, file));

      if (!command.name || typeof command.execute !== "function") {
        console.warn(
          `[WARNING] The command at ${path.join(
            folderPath,
            file
          )} is missing a required "name" or "execute" function.`
        );
        continue;
      }

      client.commands.set(command.name, command);
      console.log(`[COMMAND HANDLER] Loaded command: ${command.name}`);
    }
  }
};
