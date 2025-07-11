const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const Implementer = require("../../models/implementer");

module.exports = {
  name: "implementer-payout",
  description: "Processes a payout for an implementer.",
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    const amount = parseFloat(args[1]);

    if (!user || isNaN(amount)) {
      return message.reply(
        "`❌` Please mention a user and provide an amount to payout."
      );
    }

    try {
      const implementer = await Implementer.findOne({ userId: user.id });

      if (!implementer) {
        return message.reply("`⚠️` This user is not an implementer.");
      }

      if (implementer.balance < amount) {
        return message.reply("`💸` Not enough balance for this payout.");
      }

      implementer.balance -= amount;
      implementer.lastPayout = new Date();
      await implementer.save();

      const embed = new EmbedBuilder()
        .setTitle("Payout Processed")
        .setColor(Config.embedColorSuccess)
        .addFields(
          { name: "User", value: `<@${user.id}> (${user.id})`, inline: false },
          { name: "Amount", value: `${amount} PLN`, inline: true },
          {
            name: "New Balance",
            value: `${implementer.balance} PLN`,
            inline: true,
          },
          {
            name: "Payout Date",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: false,
          }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error("MongoDB Error:", err);
      message.reply("❌ Failed to process payout.");
    }
  },
};
