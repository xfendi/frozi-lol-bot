const { EmbedBuilder } = require("discord.js");
const Config = require("../config.json");
const partnership = require("../models/partnership");

const findAndDeleteRepresentivePartnerships = async (client, userId) => {
  const reps = await partnership.find({
    "messages.representativeId": userId,
  });

  const messageIds = reps.flatMap((doc) =>
    doc.messages
      .filter((msg) => msg.representativeId === userId)
      .map((msg) => msg.messageId)
  );

  const logChannel = await client.channels.fetch(
    Config.partnershipLogChannelId
  );

  for (const messageId of messageIds) {
    for (const doc of reps) {
      const channel = await client.channels
        .fetch(Config.partnershipChannelId)
        .catch(() => null);
      if (!channel || !channel.isTextBased()) continue;

      try {
        const msg = await channel.messages.fetch(messageId);
        await msg.delete();

        const messageData = doc.messages.find((m) => m.messageId === messageId);

        const embed = new EmbedBuilder()
          .setColor(Config.embedColorError)
          .setTitle("Partnership Deleted!")
          .setDescription(
            `> Deleted a partnership caused by <@${userId}> leaving the server.`
          )
          .addFields(
            {
              name: "Representative",
              value: `<@${userId}> (${userId})`,
              inline: false,
            },
            {
              name: "Implementer",
              value: `<@${messageData.implementerId}> (${messageData.implementerId})`,
              inline: false,
            },
            {
              name: "Invite",
              value: doc.invite,
              inline: false,
            },
            {
              name: "Message ID",
              value: messageId,
              inline: false,
            }
          )
          .setFooter({ text: Config.footerText })
          .setTimestamp();

        if (logChannel && logChannel.isTextBased()) {
          await logChannel.send({ embeds: [embed] });
        }
      } catch (err) {
        console.warn(`Failed to delete message ${messageId}:`, err.message);
      }
    }
  }
};

module.exports = { findAndDeleteRepresentivePartnerships };
