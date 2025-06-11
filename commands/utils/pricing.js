const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");

module.exports = {
  name: "pricing",
  description: "Displays the pricing information for platform",
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setDescription(
        `# \`💻 frozi.lol × PRICING\`

        > Unlock more features with our exclusive offers.
        > Here are the pricing details for our platform:

        > For more details, visit our [shop page](https://frozi.lol/shop) or contact our support team.`
      )
      .setFields(
        {
          name: "Beta Access ($2,99/Lifetime)",
          value: "Get early access to platform and new features.",
        },
        {
          name: "Premium ($5,99/Lifetime)",
          value:
            "The perfect plan to discover your creativity & unlock more features.",
        },
        {
          name: "Donator Badge ($10,99/Lifetime)",
          value: "Support the project and get a special badge on your profile.",
        },
        {
          name: "Rich Badge ($50,99/Lifetime)",
          value: "Show off your wealth with a special badge on your profile.",
        }
      )
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
