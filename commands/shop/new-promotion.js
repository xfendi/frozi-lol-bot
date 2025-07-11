const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Config = require("../../config.json");

const admin = require("firebase-admin");

const { db } = require("../../firebase");

module.exports = {
  name: "new-promotion",
  description: "Add promotion for product or product in shop",
  async execute(message, args, client) {
    const name = args[0];
    if (!name) {
      return message.reply({
        content: "`⚠️` Please provide a promotion name.",
        ephemeral: true,
      });
    }

    const existingName = await admin
      .firestore()
      .collection("promotions")
      .where("name", "==", name)
      .get();

    if (!existingName.empty) {
      return message.reply({
        content: "`⚠️` Promotion with this name already exists.",
        ephemeral: true,
      });
    }

    const product = args[1];
    console.log(product);
    if (!product) {
      return message.reply({
        content:
          "`⚠️` Please provide a product name or `all` to add promotion for all products.",
        ephemeral: true,
      });
    }

    const type = args[2];
    console.log(type);
    if (!type || (type !== "$" && type !== "%")) {
      return message.reply({
        content: "`⚠️` Please provide a promotion type: `$` or `%`.",
        ephemeral: true,
      });
    }

    const amount = args[3];
    console.log(amount);
    if (!amount || isNaN(amount)) {
      return message.reply({
        content: "`⚠️` Please provide a discount amount.",
        ephemeral: true,
      });
    }

    const confirmEmbed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setTitle("Confirm Promotion")
      .setDescription(`> Are you sure you want to add this promotion?`)
      .addFields(
        {
          name: "Name",
          value: name,
          inline: true,
        },
        {
          name: "Product",
          value: product,
          inline: true,
        },
        {
          name: "Type",
          value: type,
          inline: true,
        },
        {
          name: "Amount",
          value: amount,
          inline: true,
        }
      )
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    const yesEmoji = {
      name: "YES",
      id: "1386380343019569202",
    };

    const noEmoji = {
      name: "NO",
      id: "1386380304293429278",
    };

    const confirmButton = new ButtonBuilder()
      .setCustomId("confirm_promotion")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Success)
      .setEmoji(yesEmoji);

    const cancelButton = new ButtonBuilder()
      .setCustomId("cancel_promotion")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(noEmoji);

    const row = new ActionRowBuilder().addComponents(
      confirmButton,
      cancelButton
    );

    const msg = await message.reply({
      embeds: [confirmEmbed],
      components: [row],
    });

    const cancelCollector = msg.createMessageComponentCollector({
      filter: (i) =>
        i.customId === "cancel_promotion" && i.user.id === message.author.id,
      time: 60_000,
    });

    cancelCollector.on("collect", (interaction) => {
      message.delete().catch(() => {
        console.error("Failed to delete original message.");
        return interaction.reply({
          content: "`❌` Failed to delete original message.",
          ephemeral: true,
        });
      });
      msg.delete().catch(() => {
        console.error("Failed to delete confirmation message.");
        return interaction.reply({
          content: "`❌` Failed to delete original message.",
          ephemeral: true,
        });
      });

      return interaction.reply({
        content: "`❌` Promotion cancelled and messages deleted.",
        ephemeral: true,
      });
    });

    const confirmCollector = msg.createMessageComponentCollector({
      filter: (i) =>
        i.customId === "confirm_promotion" && i.user.id === message.author.id,
      time: 60_000,
    });

    confirmCollector.on("collect", async (interaction) => {
      await interaction.deferUpdate();

      const promoRef = db.collection("promotions");
      const snapshot = await promoRef.where("active", "==", true).get();

      if (!snapshot.empty) {
        return interaction.followUp({
          content:
            "`⚠️` There is already an active promotion. Please deactivate it first.",
          ephemeral: true,
        });
      }

      await promoRef.add({
        name,
        product,
        type,
        amount,
        active: true,
        createdAt: new Date(),
        addedBy: message.author.id,
      });

      row.components[1].setDisabled(true);
      row.components[0].setDisabled(true);
      msg.edit({ components: [row] }).catch(() => {});

      return interaction.followUp({
        content: "`✅` Promotion added successfully.",
        ephemeral: true,
      });
    });

    cancelCollector.on("end", () => {
      row.components[1].setDisabled(true);
      msg.edit({ components: [row] }).catch(() => {});
    });

    confirmCollector.on("end", () => {
      row.components[0].setDisabled(true);
      msg.edit({ components: [row] }).catch(() => {});
    });
  },
};
