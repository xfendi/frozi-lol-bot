const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const Config = require("../../config.json");

const ticketOptions = [
  {
    label: "Account",
    value: "account",
    description: "Issues with your account, login, etc.",
    emoji: "👤",
  },
  {
    label: "Purchases",
    value: "purchases",
    description: "Help with orders or payments.",
    emoji: "🛒",
  },
  {
    label: "Badge",
    value: "badge",
    description: "Questions about badges or rewards.",
    emoji: "⭐",
  },
  {
    label: "Partnership",
    value: "partnership",
    description: "Interested in working together?",
    emoji: "🤝",
  },
  {
    label: "Report User",
    value: "report",
    description: "Report a user for breaking rules.",
    emoji: "🚨",
  },
  {
    label: "Others",
    value: "others",
    description: "Anything else not listed above.",
    emoji: "❓",
  },
];

const embed = new EmbedBuilder()
  .setColor(Config.embedColorPrimary)
  .setDescription(
    `# \`💻 frozi.lol × TICKET\`

    > You need help with frozi.lol?
    > Select a topic below to open a private support ticket with our team!
        
    **Rules:**
    > - Remain available and responsive after opening a ticket.
    > - Tickets may be closed, if you dont respond within 24 hours.
    > - Please be patient and allow staff members some time to respond.
        
    **Supported Languages:**
    > - English
    > - Polish`
  )
  .setFooter({ text: Config.footerText })
  .setTimestamp();

const menu = new StringSelectMenuBuilder()
  .setCustomId("ticket-topic-select")
  .setPlaceholder("Select an option")
  .addOptions(ticketOptions);

const row = new ActionRowBuilder().addComponents(menu);

const ticketMessage = {
  embeds: [embed],
  components: [row],
};

module.exports = { ticketMessage };
