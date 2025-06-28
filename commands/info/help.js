const fs = require("fs");
const path = require("path");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");

const Config = require("../../config.json");

module.exports = {
  name: "help",
  description: "Displays a list of all available commands",

  async execute(message, args, client) {
    const commandsPath = path.join(__dirname, "../");
    const categories = fs
      .readdirSync(commandsPath)
      .filter((folder) =>
        fs.statSync(path.join(commandsPath, folder)).isDirectory()
      );

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help_select_category")
      .setPlaceholder("Choose a category")
      .addOptions(
        categories.map((category) => ({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: category,
        }))
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const baseEmbed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setTitle("Commands List")
      .setDescription(
        "Select a category from the menu below to view commands."
      )
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    const msg = await message.reply({
      embeds: [baseEmbed],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) =>
        i.customId === "help_select_category" &&
        i.user.id === message.author.id,
      time: 60_000,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();

      const selectedCategory = i.values[0];
      const categoryPath = path.join(commandsPath, selectedCategory);
      const files = fs
        .readdirSync(categoryPath)
        .filter((f) => f.endsWith(".js"));

      const embed = new EmbedBuilder()
        .setColor(Config.embedColorPrimary)
        .setTitle(`Help - ${selectedCategory}`)
        .setDescription("Available commands in this category:")
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      for (const file of files) {
        const cmd = require(path.join(categoryPath, file));
        embed.addFields({
          name: `${cmd.name}`,
          value: cmd.description || "No description provided.",
          inline: false,
        });
      }

      await msg.edit({
        embeds: [embed],
        components: [row],
      });
    });

    collector.on("end", () => {
      row.components[0].setDisabled(true);
      msg.edit({ components: [row] }).catch(() => {});
    });
  },
};
