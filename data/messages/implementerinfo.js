const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const implementer = require("../../models/implementer");
const { DEFAULT_PARTNERSHIP_PRICE, PRICE_INCREASE_PER } = require("../partnerships");

const getImplementerInfoEmbed = async (user, message) => {
  const entry = await implementer.findOne({ userId: user.id });

  if (!entry) {
    return;
  }

  const priceIncreseTimes = Math.floor(entry.amount / PRICE_INCREASE_PER);

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
    {
      name: "Price per partnership",
      value: `${entry.price ?? DEFAULT_PARTNERSHIP_PRICE} PLN`,
      inline: false,
    },
    {
      name: "Times Price Increased",
      value: `${priceIncreseTimes}x`,
      inline: true,
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
    .setColor(Config.embedColorPrimary)
    .addFields(fields)
    .setFooter({ text: Config.footerText })
    .setTimestamp();

  return embed;
};

module.exports = {
  getImplementerInfoEmbed,
};
