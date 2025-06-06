const { EmbedBuilder } = require("discord.js");
const Config = require("../config.json");

module.exports = {
  name: "guildMemberAdd",
  async execute(client, interaction) {
    const logChannel = interaction.guild.channels.cache.get(
      Config.logChannelId
    );

    const logEmbed = new EmbedBuilder()
      .setColor(Config.embedColorSuccess)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTitle("Member joined")
      .addFields({
        name: "User",
        value: `<@${interaction.user.id}> (${interaction.user.id})`,
        inline: true,
      })
      .setTimestamp()
      .setFooter({ text: `${Config.footerText}` });

    if (logChannel) {
      logChannel.send({ embeds: [logEmbed] });
    }

    const welcomerConfig = {
      welcomeMessage: {
        color: Config.embedColorPrimary,
        body: `# \`💻 frozi.lol × WELCOME\` \n \`👋\` × Welcome <@${interaction.user.id}> to __**${interaction.guild.name}**__! \n \`👥\` × You are the __**${interaction.guild.memberCount}**__ member on the server! \n \`⌛\` × I hope you'll stick around with us for a while!`,
      },
    };

    const embed = new EmbedBuilder()
      .setColor(welcomerConfig.welcomeMessage.color || Config.embedColorSuccess)
      .setDescription(welcomerConfig.welcomeMessage.body)
      .setThumbnail(interaction.user.displayAvatarURL());

    const welcomeChannel = interaction.guild.channels.cache.get(
      Config.welcomeChannelId
    );

    if (welcomeChannel) {
      welcomeChannel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [embed],
      });
    }
  },
};
