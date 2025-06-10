const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Config = require("../../config.json");

module.exports = {
  name: "verify",
  description: "Sends a verification embed with a button.",
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(Config.embedColorSuccess)
      .setDescription(
        "# `💻 frozi.lol × VERIFICATION` \n Verification is required to unlock full access to the server. \n If something goes wrong, you’ll be redirected to a new server."
      )
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel("Verify Me")
      .setStyle(ButtonStyle.Success)
      .setCustomId("verify-button");

    const row = new ActionRowBuilder().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] });
  },
};
