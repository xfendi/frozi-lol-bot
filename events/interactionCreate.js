const {
  ChannelType,
  PermissionFlagsBits,
  InteractionType,
  ComponentType,
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const Config = require("../config.json");
const { getImplementerInfoEmbed } = require("../data/messages/implementerinfo");
const implementer = require("../models/implementer");
const { MINIMUM_BALANCE_FOR_PAYOUT } = require("../data/partnerships");

const createTicket = async (interaction, type) => {
  const topic = interaction.values[0];
  const username = interaction.user.username
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "-");
  const channelName = `🎫・${topic}・${username}`;

  await interaction.deferReply({ ephemeral: true });

  const entry = await implementer.findOne({ userId: interaction.user.id });

  if (!entry && type === "payout-partnerships") {
    return interaction.reply({
      content: "`⚠️` This user is not in the implementer database.",
      ephemeral: true,
    });
  }

  if (entry && type === "apply-implementer") {
    return interaction.reply({
      content: "`⚠️` This user is already in the implementer database.",
      ephemeral: true,
    });
  }

  if (
    entry.balance < MINIMUM_BALANCE_FOR_PAYOUT &&
    type === "payout-partnership"
  ) {
    return interaction.reply({
      content: `\`⚠️\` This user does not have enough balance. Minimum balance is ${MINIMUM_BALANCE_FOR_PAYOUT} PLN.`,
      ephemeral: true,
    });
  }

  const ticketChannel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: null,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: Config.ticketRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
    ],
  });

  let description = `# \`💻 TICKET × ${topic.toUpperCase()}\`
      > **Ping:** <@${interaction.user.id}>
      > **Nick:** \`${interaction.user.username}\`
      > **ID:** \`${interaction.user.id}\`
      `;

  if (entry && type === "payout-partnerships") {
    let implementerInfo = `
    > **Added At:** <t:${Math.floor(entry.addedAt.getTime() / 1000)}:F>
  > **Amount:** \`${entry.amount}\`
  > **Balance:** \`${entry.balance} PLN\``;

    if (entry.lastPayout) {
      implementerInfo += `
    > **Last Payout:** <t:${Math.floor(entry.lastPayout.getTime() / 1000)}:F>
    `;
    } else {
      implementerInfo += `\n`;
    }

    description += implementerInfo;
  }

  description += `
  > Describe your issue in detail,
  > and our team will assist you as soon as possible.`;

  const ticketEmbed = new EmbedBuilder()
    .setColor(Config.embedColorPrimary)
    .setDescription(description)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp()
    .setFooter({ text: Config.footerText });

  const closeEmoji = {
    name: "NO",
    id: "1386380304293429278",
  };

  const closeButton = new ButtonBuilder()
    .setCustomId("close_ticket")
    .setLabel("Close Ticket")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(closeEmoji);

  const row = new ActionRowBuilder().addComponents(closeButton);

  await ticketChannel.send({
    embeds: [ticketEmbed],
    components: [row],
    content: `<@${interaction.user.id}>`,
  });

  await interaction.editReply({
    content: `\`✅\` Ticket created: <#${ticketChannel.id}>`,
  });
};

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (
      interaction.type === InteractionType.MessageComponent &&
      interaction.componentType === ComponentType.StringSelect
    ) {
      if (interaction.customId === "ticket-topic-select") {
        await createTicket(interaction);
      } else if (interaction.customId === "partnerships-info-topic-select") {
        if (interaction.values[0] === "apply-implementer") {
          await createTicket(interaction, "apply-implementer");
        } else if (interaction.values[0] === "payout-partnerships") {
          await createTicket(interaction, "payout-partnerships");
        } else if (interaction.values[0] === "implementer-info") {
          const embed = await getImplementerInfoEmbed(
            interaction.user,
            interaction
          );
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    } else if (
      interaction.type === InteractionType.MessageComponent &&
      interaction.componentType === ComponentType.Button
    ) {
      if (interaction.customId === "close_ticket") {
        if (!interaction.member.roles.cache.has(Config.ticketRoleId)) {
          return interaction.reply({
            content: "`❌` You don't have permission to close the ticket!",
            ephemeral: true,
          });
        }

        const modal = new ModalBuilder()
          .setCustomId("close_ticket_modal")
          .setTitle("Close Ticket");

        const reasonInput = new TextInputBuilder()
          .setCustomId("close_ticket_reason")
          .setLabel("Reason for closing the ticket")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Enter your reason")
          .setRequired(false);

        const row = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
      } else if (interaction.customId === "verify-button") {
        const errorMessage = "There was an error while veferifying you!";
        const roleId = Config.verifyRoleId;
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
          return interaction.reply({
            content: errorMessage,
            ephemeral: true,
          });
        }

        if (interaction.member.roles.cache.has(roleId)) {
          return interaction.reply({
            content: "You have already verified!",
            ephemeral: true,
          });
        }

        try {
          await interaction.member.roles.add(role);
          await interaction.reply({
            content: `You've been successfully verified!`,
            ephemeral: true,
          });
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: errorMessage,
            ephemeral: true,
          });
        }
      } else if (interaction.customId === "og-button") {
        const errorMessage = "There was an error while adding you role!";
        const roleId = Config.ogRoleId;
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
          return interaction.reply({
            content: errorMessage,
            ephemeral: true,
          });
        }

        if (interaction.member.roles.cache.has(roleId)) {
          return interaction.reply({
            content: "You already have this role!",
            ephemeral: true,
          });
        }

        try {
          await interaction.member.roles.add(role);
          await interaction.reply({
            content: `You have been successfully given the <@&${Config.ogRoleId}> role!`,
            ephemeral: true,
          });
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: errorMessage,
            ephemeral: true,
          });
        }
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      if (interaction.customId === "close_ticket_modal") {
        const reason =
          interaction.fields.getTextInputValue("close_ticket_reason") ||
          "No reason provided";
        const ticketChannel = interaction.channel;

        const topicFromChannel = ticketChannel.name.split("・")[1];
        const usernameFromChannel = ticketChannel.name.split("・")[2];
        const user = interaction.guild.members.cache.find(
          (member) =>
            member.user.username.toLowerCase() ===
            usernameFromChannel.toLowerCase()
        );

        await interaction.reply({
          content: "Closing Ticket ...",
          ephemeral: true,
        });

        await ticketChannel.delete();

        if (Config.archiveChannelId) {
          const archiveChannel = interaction.guild.channels.cache.get(
            Config.archiveChannelId
          );

          const closeEmbed = new EmbedBuilder()
            .setColor(Config.embedColorError)
            .setTitle("Ticket Closed")
            .addFields(
              { name: "Topic:", value: `${topicFromChannel}` },
              { name: "Opened by:", value: `${user}` },
              { name: "Closed by:", value: `${interaction.user}` },
              { name: "Reason:", value: `${reason}` }
            )
            .setFooter({ text: Config.footerText })
            .setTimestamp();

          await archiveChannel.send({ embeds: [closeEmbed] });
        }
      }
    }
  },
};
