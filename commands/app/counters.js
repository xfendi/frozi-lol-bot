const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const { db } = require("../../firebase.js");

module.exports = {
  name: "counters",
  description: "Displays all counters from app database",
  async execute(message, args, client) {
    const colRef = db.collection("counters");

    try {
      const snapshot = await colRef.get();

      if (snapshot.empty) {
        return message.reply({ content: "`❌` Counters collection is empty!" });
      }

      const embed = new EmbedBuilder()
        .setTitle("Counters!")
        .setDescription("> Here are all the counters from the database:")
        .setColor(Config.embedColorPrimary)
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const prettyData = Object.entries(data)
          .map(([key, value]) => `> **${key}**: \`${value}\``)
          .join("\n");

        embed.addFields({
          name: `${doc.id}`,
          value: prettyData || "No data found",
          inline: false,
        });
      });

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching counters:", error);
      await message.reply({
        content: "`❌` Error fetching counters from the database.",
      });
    }
  },
};
