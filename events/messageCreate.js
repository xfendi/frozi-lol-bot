const { EmbedBuilder } = require("discord.js");
const { prefix, ownerId } = require("../config.json");
const Config = require("../config.json");
const Implementer = require("../models/implementer");
const {
  DEFAULT_PARTNERSHIP_PRICE,
  MINIMUM_DAYS_BETWEEN_PARTNERSHIPS,
} = require("../data/partnerships");
const partnership = require("../models/partnership");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author.bot) return;

    const member = message.guild.members.cache.get(message.author.id);

    if (
      message.channel.id === Config.partnershipChannelId &&
      member.roles.cache.has(Config.implementerRoleId)
    ) {
      const firstMention = message.mentions.users.first();
      if (!firstMention) {
        return message.reply({
          content: "`⚠️` No user mentioned!",
          ephemeral: true,
        });
      }

      const mentionedUserId = firstMention.id;

      const inviteRegex =
        /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/gi;
      const invites = message.content.match(inviteRegex);
      const firstInvite = invites ? invites[0] : null;

      if (!firstInvite) {
        return message.reply({
          content: "`⚠️` No invite link found!",
          ephemeral: true,
        });
      }

      try {
        const threeDaysAgo = new Date(
          Date.now() - MINIMUM_DAYS_BETWEEN_PARTNERSHIPS * 24 * 60 * 60 * 1000
        );

        const recentAd = await partnership.findOne({
          invite: firstInvite,
          lastAdvertisedAt: { $gte: threeDaysAgo },
        });

        if (recentAd) {
          message.delete();

          const cooldownEnd = new Date(
            recentAd.lastAdvertisedAt.getTime() +
              MINIMUM_DAYS_BETWEEN_PARTNERSHIPS * 24 * 60 * 60 * 1000
          );
          const cooldownTimestamp = Math.floor(cooldownEnd.getTime() / 1000);

          const embed = new EmbedBuilder()
            .setColor(Config.embedColorWarning)
            .setTitle("Advertisement cooldown active!")
            .setDescription(
              `> This server has already been advertised on our server in the **last 3 days**!

              > You can contect to the diferent partnerships implementer of the server you want to advertise.`
            )
            .addFields(
              {
                name: "Invite used",
                value: firstInvite,
                inline: false,
              },
              {
                name: "Next possible advertisement of this server",
                value: `<t:${cooldownTimestamp}:R>`,
                inline: false,
              }
            )
            .setFooter({ text: Config.footerText })
            .setTimestamp();

          return await message.author.send({ embeds: [embed] });
        }

        let user = await Implementer.findOne({ userId: message.author.id });

        if (!user) {
          return message.reply({
            content: "`⚠️` This user is not in the implementer database.",
            ephemeral: true,
          });
        }

        const amountToAdd = user.price ?? DEFAULT_PARTNERSHIP_PRICE;
        const newBalance = user.balance + amountToAdd;

        user.balance = Number(newBalance.toFixed(2));

        user.amount += 1;

        user.lastAdvertisedAt = new Date();
        user.partnerships.push({
          representiveId: mentionedUserId,
          invite: firstInvite,
          createdAt: new Date(),
          messageId: message.id,
        });

        await user.save();

        const existing = await partnership.findOne({ invite: firstInvite });

        if (existing) {
          existing.messages.push({
            implementerId: user.userId,
            representativeId: mentionedUserId,
            createdAt: new Date(),
            messageId: message.id,
          });

          existing.lastAdvertisedAt = new Date();
          await existing.save();
        } else {
          const newPartnership = new partnership({
            invite: firstInvite,
            lastAdvertisedAt: new Date(),
            messages: [
              {
                implementerId: user.userId,
                representativeId: mentionedUserId,
                createdAt: new Date(),
                messageId: message.id,
              },
            ],
          });

          await newPartnership.save();
        }

        const partnershipLogChannel = await client.channels.fetch(
          Config.partnershipLogChannelId
        );

        const logEmbed = new EmbedBuilder()
          .setColor(Config.embedColorSuccess)
          .setTitle("New partnership!")
          .setDescription(`> New partnership made by <@${user.userId}>!`)
          .addFields(
            {
              name: "Invite",
              value: firstInvite,
              inline: false,
            },
            {
              name: "Representative",
              value: `<@${mentionedUserId}>`,
              inline: false,
            },
            {
              name: "New Amount",
              value: `${user.amount}`,
              inline: false,
            },
            {
              name: "New Balance",
              value: `${user.balance} PLN`,
              inline: false,
            }
          )
          .setFooter({ text: Config.footerText })
          .setTimestamp();

        await partnershipLogChannel.send({ embeds: [logEmbed] });

        const embed = new EmbedBuilder()
          .setColor(Config.embedColorPrimary)
          .setDescription(
            `# \`💻 frozi.lol × NEW PARTNERSHIP\`
> **Partnership representative:** <@${mentionedUserId}>
> **Invite:** ${firstInvite}

> **Implementer:** <@${user.userId}>
> **New Amount:** \`${user.amount}\`
> **New Balance:** \`${user.balance} PLN\`

> _Servers shared in this channel haven’t been checked for legitimacy. We are not responsible for any losses outside of our server!_`
          )
          .setThumbnail(message.author.displayAvatarURL())
          .setFooter({ text: Config.footerText })
          .setTimestamp();

        message.reply({ embeds: [embed] });
      } catch (err) {
        console.error("❌ Error while advertising partnership:", err);
        message.reply({
          content: "`❌` An error occurred. Try again later.",
        });
      }
    }

    if (!message.content.startsWith(prefix) || message.author.id !== ownerId)
      return;

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
