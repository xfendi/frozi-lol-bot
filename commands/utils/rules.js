const { EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");

module.exports = {
  name: "rules",
  description: "Displays the server rules.",
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(Config.embedColorPrimary)
      .setDescription(
        `# \`💻 frozi.lol × RULES\`

        > We know this can seem annoying at first, but the following rules are really important to keep our server a safe and comfortable place, so **please read all of them!**
        
        **1.** Be respectful and kind to others.
        **2.** No spamming.
        **3.** Dont misuse channels. (e.g. sending your bio in #media)
        **4.** No NSFW or explicit content.
        **5.** No unauthorized advertising.
        **6.** Respect privacy and don't share personal info.
        **7.** No impersonation or deception. (especially impersonating a staff)
        **8.** Follow Discord's Terms of Service.
        **9.** Respect moderators and their decisions.
        **10.** Avoid drama and conflicts.
        **11.** Use appropriate language (racial slurs are strictly prohibited)
        **12.** English only (Excluding support channels/tickets)
        **13.** Bypassing auto mod is strictly prohibited.
        **14.** Any sort of sexual harassment/reference, whether it is a joke or not is either a warning or an instant ban.
        **15.** Pictures and content deemed inappropriate are strictly prohibited.
        
        __If a rule isn't listed, please use common sense, staff have the right to punish you for anything that is not listed here if they see it fit.__`
      )
      .setFooter({ text: Config.footerText })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
