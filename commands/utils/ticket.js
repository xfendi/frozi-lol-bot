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
    emoji: "👤",
  },
  {
    label: "Purchases",
    value: "purchases",
    emoji: "🛒",
  },
  {
    label: "Badge",
    value: "badge",
    emoji: "⭐",
  },
  {
    label: "Partnership",
    value: "partnership",
    emoji: "🤝",
  },
  {
    label: "Report User",
    value: "report",
    emoji: "🚨",
  },
  {
    label: "Others",
    value: "others",
    emoji: "❓",
  },
];

module.exports = {
  name: "ticket",
  description: "Send the ticket menu.",
  async execute(message, args, client) {
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
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket-topic-select")
      .setPlaceholder("Select an option")
      .addOptions(ticketOptions);

    const row = new ActionRowBuilder().addComponents(menu);

    message.channel.send({
      embeds: [embed],
      components: [row],
    });
  },
};
