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

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (
      interaction.type === InteractionType.MessageComponent &&
      interaction.componentType === ComponentType.StringSelect
    ) {
      if (interaction.customId === "ticket-topic-select") {
        const topic = interaction.values[0];
        const username = interaction.user.username
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, "-");
        const channelName = `🎫・${topic}・${username}`;

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

        const ticketEmbed = new EmbedBuilder()
          .setColor(Config.embedColorPrimary)
          .setDescription(
            `# \`💻 TICKET × ${topic.toUpperCase()}\`

            > Describe your issue in detail, and our team will assist you as soon as possible.

            > **Ticket created by:** <@${interaction.user.id}>\n`
          )
          .setTimestamp()
          .setFooter({ text: Config.footerText });

        const closeEmoji = {
          name: "nie",
          id: "998637736879730708",
        };

        const closeButton = new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger)
          .setEmoji(closeEmoji);

        const row = new ActionRowBuilder().addComponents(closeButton);

        await ticketChannel.send({
          embeds: [ticketEmbed],
          components: [row],
          content: `<@${interaction.user.id}>`,
        });

        await interaction.reply({
          content: `\`✅\` Ticket created: <#${ticketChannel.id}>`,
          ephemeral: true,
        });
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
