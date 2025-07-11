const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const Implementer = require("../../models/implementer");

module.exports = {
  name: "remove-implementer",
  description: "Removes an implementer from the database by mention.",
  async execute(message, args, client) {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply("`❌` Please mention a user to remove as implementer.");
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply("`❌` Could not find that member in this server.");
    }

    try {
      const existing = await Implementer.findOne({ userId: user.id });

      if (!existing) {
        return message.reply("`⚠️` This user is not an implementer in the database.");
      }

      await Implementer.deleteOne({ userId: user.id });

      await member.roles.remove(Config.implementerRoleId);

      const embed = new EmbedBuilder()
        .setTitle("Implementer removed")
        .setDescription("The user has been removed from the database and the role was taken away.")
        .addFields({
          name: "User",
          value: `<@${user.id}> (${user.id})`,
          inline: false,
        })
        .setColor(Config.embedColorError)
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error("MongoDB Error:", err);
      message.reply("`❌` Failed to remove implementer from the database.");
    }
  },
};
