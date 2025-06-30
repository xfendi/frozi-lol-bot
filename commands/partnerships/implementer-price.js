const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const Implementer = require("../../models/implementer");

module.exports = {
  name: "implementer-price",
  description: "Sets the new price for an implementer.",
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    const newPrice = parseFloat(args[1]);

    if (!user || isNaN(newPrice)) {
      return message.reply("`❌` Please mention a user and provide new price.");
    }

    try {
      const implementer = await Implementer.findOne({ userId: user.id });

      if (!implementer) {
        return message.reply("`⚠️` This user is not an implementer.");
      }

      implementer.price = newPrice;
      await implementer.save();

      const embed = new EmbedBuilder()
        .setTitle("Price updated")
        .setColor(Config.embedColorSuccess)
        .addFields(
          { name: "User", value: `<@${user.id}> (${user.id})`, inline: false },
          { name: "New Price", value: `${newPrice} PLN`, inline: true }
        )
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error("MongoDB Error:", err);
      message.reply("❌ Failed to update price.");
    }
  },
};
