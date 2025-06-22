const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const implementer = require("../../models/implementer");

const getImplementerInfoEmbed = async (user, message) => {
  const entry = await implementer.findOne({ userId: user.id });

  if (!entry) {
    return;
  }

  let fields = [
    { name: "User", value: `<@${user.id}> (${user.id})`, inline: false },
    {
      name: "Added At",
      value: `<t:${Math.floor(entry.addedAt.getTime() / 1000)}:F>`,
      inline: false,
    },
    {
      name: "Partnerships Amount",
      value: `${entry.amount}`,
      inline: false,
    },
    {
      name: "Balance",
      value: `${entry.balance} PLN`,
      inline: false,
    },
  ];

  if (entry.lastPayout) {
    fields.push({
      name: "Last Payout",
      value: `<t:${Math.floor(entry.lastPayout.getTime() / 1000)}:F>`,
      inline: false,
    });
  }

  const embed = new EmbedBuilder()
    .setTitle("Implementer Info")
    .setColor("#00BFFF")
    .addFields(fields)
    .setFooter({ text: Config.footerText })
    .setTimestamp();

  return embed;
};

module.exports = {
  getImplementerInfoEmbed,
};
