const {
  getImplementerInfoEmbed,
} = require("../../data/messages/implementerinfo");

module.exports = {
  name: "implementer-info",
  description: "Shows information about an implementer by mention.",
  async execute(message, args, client) {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply("`❌` Please mention a user to check.");
    }

    const embed = await getImplementerInfoEmbed(user, message);

    if (!embed) {
      return message.reply("`⚠️` This user is not in the implementer database.");
    }

    try {
      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error("MongoDB Error:", err);
      message.reply("`❌` Failed to fetch implementer information.");
    }
  },
};
