const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const {
  remindInactiveImplementers,
} = require("../../scripts/partnershipsReminder");

module.exports = {
  name: "remind-implementers",
  description: "Reminds inactive implementers",
  execute(message, args, client) {
    console.log("Reminding implementers");
    remindInactiveImplementers(client);

    const embed = new EmbedBuilder()
      .setColor(Config.embedColorSuccess)
      .setTitle("Reminded Implementers!")
      .setDescription(`Successfully reminded all inactive implementers.`)
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
