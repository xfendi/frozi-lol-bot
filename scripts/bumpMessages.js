const Config = require("../config.json");
const { DEFAULT_REFRESH_INTERVAL, bumpInfo } = require("../data/bumpInfo");

const startBumpRefresher = (client) => {
  const logChannel = client.channels.fetch(Config.logChannelId);

  const refresh = async () => {
    for (const { channelId, message } of bumpInfo) {
      const channel = client.channels.cache.get(channelId);
      if (!channel) {
        console.warn(`⚠️ Channel ${channelId} not found`);
        continue;
      }

      try {
        const messages = await channel.messages.fetch({ limit: 10 });
        const botMessages = messages.filter(
          (m) => m.author.id === client.user?.id
        );
        let deleted = 0;
        for (const [, msg] of botMessages) {
          if (deleted >= 5) break;
          await msg.delete().catch(() => {});
          deleted++;
        }

        await channel.send(message);

        console.log(`✅ Refreshed / Bumped message in #${channel.name}`);
        if (logChannel && logChannel.type === "GUILD_TEXT") {
          await logChannel.send({
            content: `\`✅\` Refreshed / Bumped message in <#${channelId}>`,
          });
        }
      } catch (err) {
        console.error(
          `❌ Failed to refresh / bump message in ${channelId}:`,
          err
        );
        if (logChannel && logChannel.type === "GUILD_TEXT") {
          await logChannel.send({
            content: `\`❌\` Failed to refresh / bump message in <#${channelId}>: ${err.message}`,
          });
        }
      }
    }
  };

  refresh();
  setInterval(refresh, DEFAULT_REFRESH_INTERVAL);
};

module.exports = { startBumpRefresher };
