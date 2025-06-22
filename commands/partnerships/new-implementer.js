const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const Implementer = require("../../models/implementer");

module.exports = {
  name: "new-implementer",
  description: "Adds a new implementer to the database by mention.",
  async execute(message, args, client) {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply("`❌` Please mention a user to add as implementer.");
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply("`❌` Could not find that member in this server.");
    }

    try {
      const newEntry = new Implementer({
        userId: user.id,
        amount: 0,
        balance: 0,
        addedAt: new Date(),
      });
      await newEntry.save();

      await member.roles.add(Config.implementerRoleId);

      const embed = new EmbedBuilder()
        .setTitle("Implementer added")
        .setDescription(
          "This user has been added to the database and assigned the role."
        )
        .addFields({
          name: "User",
          value: `<@${user.id}> (${user.id})`,
          inline: false,
        })
        .setColor(Config.embedColorSuccess)
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error("MongoDB Error:", err);
      if (err.code === 11000) {
        message.reply("`⚠️` This user is already an implementer.");
      } else {
        message.reply("`❌` Failed to save implementer to the database.");
      }
    }
  },
};
