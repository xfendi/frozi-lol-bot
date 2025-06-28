const { HOURS_FOR_LAST_PARTNERSHIP } = require("../data/partnerships");
const config = require("../config.json");

const implementer = require("../models/implementer");
const { EmbedBuilder } = require("discord.js");

const DAY_MS = HOURS_FOR_LAST_PARTNERSHIP * 60 * 60 * 1000;

async function remindInactiveImplementers(client) {
  const now = new Date();
  const since = new Date(now.getTime() - DAY_MS);

  console.log(`[INFO] Starting reminder for inactive implementers!`);

  const implementers = await implementer.find({});

  for (const impl of implementers) {
    const partnershipDone = await implementer.findOne({
      userId: impl.userId,
      lastAdvertisedAt: { $gte: since },
    });

    if (!partnershipDone) {
      try {
        const user = await client.users.fetch(impl.userId);
        const dm = await user.createDM();

        const messages = await dm.messages.fetch({ limit: 10 });
        const botMessages = messages.filter(
          (msg) => msg.author.id === client.user.id
        );

        for (const [id, msg] of botMessages) {
          try {
            await msg.delete();
          } catch (e) {
            console.error(e);
          }
        }

        const dmEmbed = new EmbedBuilder()
          .setColor(config.embedColorWarning)
          .setTitle(
            `You haven't done any partnerships in the last ${HOURS_FOR_LAST_PARTNERSHIP} hours!`
          )
          .setDescription(
            `> Hey <@${impl.userId}>, we noticed you haven’t completed a single partnership in the last **${HOURS_FOR_LAST_PARTNERSHIP} hours**.

            > Please remember to stay active and complete your daily partnerships to maintain your implementer status.`
          )
          .setFooter({ text: config.footerText })
          .setTimestamp();

        await dm.send({ embeds: [dmEmbed] });

        const partnershipLogChannel = await client.channels.fetch(
          config.partnershipLogChannelId
        );

        const fields = [
          {
            name: "Implementer",
            value: `<@${impl.userId}> (${impl.userId})`,
            inline: false,
          },
        ];

        if (impl.lastAdvertisedAt) {
          fields.push({
            name: "Last advertisement",
            value: `<t:${Math.floor(
              impl.lastAdvertisedAt.getTime() / 1000
            )}:R>`,
            inline: false,
          });
        }

        const logEmbed = new EmbedBuilder()
          .setColor(config.embedColorWarning)
          .setTitle("Implementer inactive!")
          .setDescription(
            `> Implementer has not done any partnerships in the last **${HOURS_FOR_LAST_PARTNERSHIP} hours**!`
          )
          .addFields(fields)
          .setFooter({ text: config.footerText })
          .setTimestamp();

        await partnershipLogChannel.send({ embeds: [logEmbed] });

        console.log(`Sent DM to ${impl.userId}`);
      } catch (err) {
        console.error(`Failed to send DM to ${impl.userId}`, err);
      }
    }
  }
}

module.exports = { remindInactiveImplementers };
