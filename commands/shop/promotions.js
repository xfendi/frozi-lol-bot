const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Config = require("../../config.json");

const admin = require("firebase-admin");
const { StringSelectMenuBuilder } = require("discord.js");
const { db } = require("../../firebase");

module.exports = {
  name: "promotions",
  description: "AList and manage promotions for products in the shop",
  async execute(message, args, client) {
    const allPromoions = await admin.firestore().collection("promotions").get();

    if (allPromoions.empty) {
      return message.reply({
        content: "`⚠️` There are no promotions in the database.",
        ephemeral: true,
      });
    }

    const promotionsData = allPromoions.docs.map((doc) => doc.data());

    const listEmbed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setTitle("Promotions List")
      .setFields({
        name: "Currently Active Promotion",
        value: promotionsData.find((p) => p.active)
          ? promotionsData.find((p) => p.active).name
          : "None",
      })
      .setDescription(`> Here are the available promotions from database.`);

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select_promotion")
      .setPlaceholder("Choose a promotion to view details")
      .addOptions(
        promotionsData.map((promotion) => ({
          label: `${promotion.name} - ${promotion.product}` || "N/A",
          description: `${promotion.type} ${promotion.amount}`,
          value: `${promotion.name}`,
        }))
      );

    const listRow = new ActionRowBuilder().addComponents(selectMenu);

    const msg = await message.reply({
      embeds: [listEmbed],
      components: [listRow],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.customId === "select_promotion",
      time: 60_000,
    });

    let infoMsg;

    const yesEmoji = {
      name: "YES",
      id: "1386380343019569202",
    };

    const noEmoji = {
      name: "NO",
      id: "1386380304293429278",
    };

    const activateButton = new ButtonBuilder()
      .setCustomId("activate_promotion")
      .setLabel("Activate")
      .setStyle(ButtonStyle.Success)
      .setEmoji(yesEmoji);

    const deleteButton = new ButtonBuilder()
      .setCustomId("delete_promotion")
      .setLabel("Delete")
      .setStyle(ButtonStyle.Danger)
      .setEmoji(noEmoji);

    const infoRow = new ActionRowBuilder().addComponents(
      activateButton,
      deleteButton
    );

    let currentPromotion;

    collector.on("collect", async (interaction) => {
      const selectedPromotion = promotionsData.find(
        (promotion) => promotion.name === interaction.values[0]
      );

      if (!selectedPromotion) {
        return interaction.reply({
          content: "`⚠️` This promotion doesn't exist.",
          ephemeral: true,
        });
      }

      currentPromotion = selectedPromotion;

      const infoEmbed = new EmbedBuilder()
        .setColor(Config.embedColorPrimary)
        .setTitle("Promotion Information")
        .setDescription(`> Here are the details of the promotion.`)
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      infoEmbed.addFields(
        {
          name: "Name",
          value: selectedPromotion?.name || "N/A",
          inline: true,
        },
        {
          name: "Product",
          value: selectedPromotion?.product || "N/A",
          inline: true,
        },
        {
          name: "Type",
          value: selectedPromotion?.type || "N/A",
          inline: true,
        },
        {
          name: "Amount",
          value: selectedPromotion?.amount?.toString() || "N/A",
          inline: true,
        },
        {
          name: "Added By",
          value: selectedPromotion?.addedBy
            ? `<@${selectedPromotion.addedBy}> (${selectedPromotion.addedBy})`
            : "N/A",
        },
        {
          name: "Created At",
          value: selectedPromotion?.createdAt
            ? `<t:${Math.floor(selectedPromotion.createdAt / 1000)}:F>`
            : "N/A",
        }
      );

      if (selectedPromotion?.active) {
        activateButton
          .setLabel("Deactive")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(noEmoji);
      }

      infoMsg = await interaction.reply({
        embeds: [infoEmbed],
        components: [infoRow],
      });
    });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;

      if (interaction.customId === "activate_promotion") {
        await interaction.deferUpdate();

        const promoRef = db.collection("promotions");
        const snapshot = await promoRef
          .where("name", "==", currentPromotion.name)
          .get();

        if (
          !snapshot.empty &&
          snapshot.docs[0].data().name !== currentPromotion.name
        ) {
          return interaction.followUp({
            content:
              "`⚠️` There is already an active promotion. Please deactivate it first.",
            ephemeral: true,
          });
        }

        if (currentPromotion.active) {
          await promoRef.doc(snapshot.docs[0].id).update({ active: false });

          infoRow.components[0].setDisabled(true);
          infoRow.components[1].setDisabled(true);
          infoMsg.edit({ components: [infoRow] }).catch(() => {});

          return interaction.followUp({
            content: "`✅` Promotion deactivated successfully.",
            ephemeral: true,
          });
        }

        await promoRef.doc(snapshot.docs[0].id).update({ active: true });

        infoRow.components[0].setDisabled(true);
        infoRow.components[1].setDisabled(true);
        infoMsg.edit({ components: [infoRow] }).catch(() => {});

        return interaction.followUp({
          content: "`✅` Promotion activated successfully.",
          ephemeral: true,
        });
      } else if (interaction.customId === "delete_promotion") {
        await interaction.deferUpdate();

        const promoRef = db.collection("promotions");
        const snapshot = await promoRef
          .where("name", "==", currentPromotion.name)
          .get();

        if (snapshot.empty) {
          return interaction.followUp({
            content: "`⚠️` This promotion doesn't exist.",
            ephemeral: true,
          });
        }

        await promoRef.doc(snapshot.docs[0].id).delete();

        infoRow.components[0].setDisabled(true);
        infoRow.components[1].setDisabled(true);
        infoMsg.edit({ components: [infoRow] }).catch(() => {});

        return interaction.followUp({
          content: "`✅` Promotion deleted successfully.",
          ephemeral: true,
        });
      }
    });

    collector.on("end", () => {
      listRow.components[0].setDisabled(true);
      msg.edit({ components: [listRow] }).catch(() => {});
    });
  },
};
