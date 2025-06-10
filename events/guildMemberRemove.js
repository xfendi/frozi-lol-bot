const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");
const Config = require("../config.json");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(client, member) {
    const logChannel = member.guild.channels.cache.get(
      Config.logChannelId
    );

    if (logChannel) {
      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberKick,
      });

      const kickLog = fetchedLogs.entries.first();

      const kickTime = kickLog ? kickLog.createdAt : null;
      const currentTime = new Date();
      const timeDifference = (currentTime - kickTime) / 1000;

      const roles =
        member.roles.cache
          .filter((role) => role.id !== member.guild.id)
          .map((role) => `<@&${role.id}>`)
          .join(", ") || "No roles";

      if (
        kickLog &&
        kickLog.target.id === member.user.id &&
        timeDifference < 10
      ) {
        const { executor, target, reason } = kickLog;
        const leaveEmbed = new EmbedBuilder()
          .setColor(Config.embedColorError)
          .setAuthor({
            name: target.tag,
            iconURL: target.displayAvatarURL(),
          })
          .setThumbnail(target.displayAvatarURL())
          .setTitle("Member kicked")
          .addFields(
            {
              name: "Reason",
              value: reason,
            },
            {
              name: "Moderator",
              value: `<@${executor.id}>`,
            },
            {
              name: "User",
              value: `<@${target.id}> (${target.id})`,
            },
            {
              name: "Roles",
              value: roles,
            }
          );
        logChannel.send({ embeds: [leaveEmbed] });
      } else {
        const leaveEmbed = new EmbedBuilder()
          .setColor(Config.embedColorError)
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL(),
          })
          .setThumbnail(member.user.displayAvatarURL())
          .setTitle("Member left")
          .addFields(
            {
              name: "User",
              value: `<@${member.user.id}> (${member.user.id})`,
            },
            {
              name: "Roles",
              value: roles,
            }
          )
          .setFooter({ text: `${Config.footerText}` })
          .setTimestamp();

        logChannel.send({ embeds: [leaveEmbed] });
      }
    }
  },
};
