const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");

const partnersInfoEmbed = new EmbedBuilder()
  .setColor(Config.embedColorPrimary)
  .setDescription(
    `# \`💻 frozi.lol × PARTNERS\`

    > We are proud to partner with some amazing communities and platforms.
    > If you are interested in becoming a partner, please contact us via <#${Config.ticketChannelId}>
        
    > Here are requirements to become a partner:

    > - Must have at least **200 members** in your discord community.
    > - Must be active and engaged with your community.
    > - Must be willing to promote **frozi.lol** on your platform.

    > For more details, visit our [partners page](https://frozi.lol/partners) or contact our support team.`
  )
  .setFooter({ text: Config.footerText })
  .setTimestamp();

const partnersInfoMessage = {
  embeds: [partnersInfoEmbed],
};

module.exports = {
  partnersInfoMessage,
};
