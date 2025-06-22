const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const { bumpInfo } = require("../../data/bumpInfo");
const { startBumpRefresher } = require("../../scripts/bumpMessages");

module.exports = {
  name: "bump",
  description: "Bumps all listed messages",
  execute(message, args, client) {
    startBumpRefresher(client);

    const embed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setTitle("Bumped Messages!")
      .setDescription(`Successfully bumped all messages on listed channels.`)
      .addFields(
        { name: "Channels", value: `${bumpInfo.length}` },
        {
          name: "Channels List",
          value: `${bumpInfo
            .map(({ channelId }) => `<#${channelId}>`)
            .join("\n")}`,
        }
      )
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
