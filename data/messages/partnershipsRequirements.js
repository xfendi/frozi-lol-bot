const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");

const getPartnershipsRequirementsEmbed = () => {
  let fields = [
    "> - Must have at least **50 members** in your discord community. If you have less than 50 members, you need to post our advertisement in your server with `@everyone` ping.",
    "> - it can't be a **Invites = something** server.",
    "> - It can't be absolutely dead server.",
  ];

  const embed = new EmbedBuilder()
    .setTitle("Partnerships Requirements")
    .setColor(Config.embedColorPrimary)
    .setDescription(fields.join("\n"))
    .setFooter({ text: Config.footerText })
    .setTimestamp();

  return embed;
};

module.exports = {
  getPartnershipsRequirementsEmbed,
};
