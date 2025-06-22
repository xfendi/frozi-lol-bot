const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const Config = require("../../config.json");

const ticketOptions = [
  {
    label: "Apply for Implementer",
    value: "apply-implementer",
    description: "Apply for implementer role",
    emoji: "💼",
  },
  {
    label: "Implementer Info",
    value: "implementer-info",
    description: "Displays information for implementers",
    emoji: "👤",
  },
  {
    label: "Payout",
    value: "payout-partnerships",
    description: "Open ticket for payout your partnership",
    emoji: "💸",
  },
];

const embed = new EmbedBuilder()
  .setColor(Config.embedColorPrimary)
  .setDescription(
    `# \`💻 frozi.lol × PARTNERSHIPS INFO\`

    > You need help or have a question about partnerships on frozi.lol?`
  )
  .setFooter({ text: Config.footerText })
  .setTimestamp();

const menu = new StringSelectMenuBuilder()
  .setCustomId("partnerships-info-topic-select")
  .setPlaceholder("Select an option")
  .addOptions(ticketOptions);

const row = new ActionRowBuilder().addComponents(menu);

const partnershipsInfoMessage = {
  embeds: [embed],
  components: [row],
};

module.exports = { partnershipsInfoMessage };
