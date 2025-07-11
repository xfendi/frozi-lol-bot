const admin = require("firebase-admin");
const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");

module.exports = {
  name: "list-admin-codes",
  description: "Lists all available admin codes.",
  async execute(message, args, client) {
    try {
      const snapshot = await admin
        .firestore()
        .collection("adminCodes")
        .where("used", "==", false)
        .get();

      if (snapshot.empty) {
        return message.reply("`📭` No available admin codes found.");
      }

      const fields = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate();
        const formattedDate = `<t:${Math.floor(createdAt.getTime() / 1000)}:F>`;

        return {
          name: ``,
          value: `> **Created At:** ${formattedDate}
          > **Created By:** <@${data.createdBy}> (${data.createdBy})
          > **Code:** \`${data.code}\``,
          inline: false,
        };
      });

      const embed = new EmbedBuilder()
        .setTitle("Available Admin Codes")
        .setDescription(`> Use the code to access the closed platform.`)
        .setColor(Config.embedColorPrimary)
        .addFields(fields)
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error while listing admin codes:", error);
      message.reply("`❌` An error occurred while fetching admin codes.");
    }
  },
};
