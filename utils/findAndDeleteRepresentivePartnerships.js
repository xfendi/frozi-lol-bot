const { EmbedBuilder } = require("discord.js");
const Config = require("../config.json");
const partnership = require("../models/partnership");

const findAndDeleteRepresentivePartnerships = async (client, userId) => {
  const reps = await partnership.find({
    "messages.representativeId": userId,
  });

  const member = await client.users.fetch(userId);

  const logChannel = await client.channels.fetch(
    Config.partnershipLogChannelId
  );

  for (const doc of reps) {
    const messagesToDelete = doc.messages.filter(
      (msg) => msg.representativeId === userId
    );

    const channel = await client.channels
      .fetch(Config.partnershipChannelId)
      .catch(() => null);
    if (!channel || !channel.isTextBased()) continue;

    for (const messageData of messagesToDelete) {
      try {
        const msg = await channel.messages.fetch(messageData.messageId);
        await msg.delete();

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
            { name: "Invite", value: doc.invite, inline: false },
            { name: "Message ID", value: messageData.messageId, inline: false }
          )
          .setFooter({ text: Config.footerText })
          .setTimestamp();

        const dmEmbed = new EmbedBuilder()
          .setTitle("Partnership Deleted!")
          .setColor(Config.embedColorError)
          .setDescription(
            `> Your partnership has been removed because you left our server.`
          )
          .addFields({
            name: "Invite",
            value: doc.invite,
            inline: false,
          })
          .setFooter({ text: Config.footerText })
          .setTimestamp();

        if (logChannel && logChannel.isTextBased()) {
          await logChannel.send({ embeds: [embed] });
        }

        if (member) {
          await member.send({ embeds: [dmEmbed] });
        }
      } catch (err) {
        console.warn(
          `Failed to delete message ${messageData.messageId}:`,
          err.message
        );
      }
    }

    await partnership.updateOne(
      { _id: doc._id },
      { $pull: { messages: { representativeId: userId } } }
    );

    const updatedDoc = await partnership.findById(doc._id);

    if (!updatedDoc.messages || updatedDoc.messages.length === 0) {
      await partnership.deleteOne({ _id: doc._id });

      const embed = new EmbedBuilder()
        .setColor(Config.embedColorError)
        .setTitle("Empty Partnership Deleted!")
        .setDescription(
          `> Deleted a entire partnership from database caused by <@${userId}> leaving the server.`
        )
        .addFields({ name: "Invite", value: doc.invite, inline: false })
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({ embeds: [embed] });
      }
    }
  }
};

module.exports = { findAndDeleteRepresentivePartnerships };
