const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Config = require("../../config.json");

module.exports = {
  name: "og",
  description: "Sends a og role embed with a button.",
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setDescription(
        `# \`💻 frozi.lol × OG\` \n Get your <@&${Config.ogRoleId}> role and let the flex begin!
        It is only available until project official launch.
        `
      )
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel("Get Role")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("og-button");

    const row = new ActionRowBuilder().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] });
  },
};
