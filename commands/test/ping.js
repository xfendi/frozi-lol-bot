const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");

module.exports = {
  name: "ping",
  description: "Checks the bot latency",
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setTitle("Pong!  🏓")
      .setDescription(`Current Bot latency is: \`${client.ws.ping} ms\``)
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
