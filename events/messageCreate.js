const { EmbedBuilder } = require("discord.js");
const { prefix, ownerId } = require("../config.json");
const Config = require("../config.json");
const Implementer = require("../models/implementer");
const { DEFAULT_PARTNERSHIP_PRICE } = require("../data/partnerships");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author.bot || message.author.id !== ownerId) return;

    if (message.channel.id === Config.partnershipChannelId) {
      const firstMention = message.mentions.users.first();
      if (!firstMention) return;

      const mentionedUserId = firstMention.id;

      try {
        let user = await Implementer.findOne({ userId: message.author.id });

        if (!user) {
          return message.reply({
            content: "`⚠️` This user is not in the implementer database.",
            ephemeral: true,
          });
        } else {
          user.amount += 1;
          const newBalance = user.balance += DEFAULT_PARTNERSHIP_PRICE;
          let rounded = Number(newBalance.toFixed(2));

          user.balance = rounded;
        }

        await user.save();

        const embed = new EmbedBuilder()
          .setColor(Config.embedColorPrimary)
          .setDescription(
            `# \`💻 frozi.lol × NEW PARTNERSHIP\`

            > **Partnership representative:** <@${mentionedUserId}>
        
            > **Implementer:** <@${user.userId}>
            > **New Amount:** \`${user.amount}\`
            > **New Balance:** \`${user.balance} PLN\``
          )
          .setThumbnail(message.author.displayAvatarURL())
          .setFooter({ text: Config.footerText })
          .setTimestamp();

        message.reply({ embeds: [embed] });
      } catch (err) {
        console.error("❌ Błąd przy zapisie do MongoDB:", err);
      }
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      command.execute(message, args, client);
    } catch (err) {
      console.error(err);
      message.reply("❌ Something went wrong while executing the command.");
    }
  },
};
