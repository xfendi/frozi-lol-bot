const Config = require("../../config.json");

const { EmbedBuilder } = require("discord.js");
const { db } = require("../../firebase");

const generateUniqueAdminCode = async () => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const keyLength = 16;

  let key;
  let exists = true;

  while (exists) {
    key = "";
    for (let i = 0; i < keyLength; i++) {
      key += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const doc = await db.collection("adminCodes").doc(key).get();
    exists = doc.exists;
  }

  return key;
};

module.exports = {
  name: "generate-admin-code",
  description: "Generates an admin code for web access.",
  async execute(message, args, client) {
    try {
      const code = await generateUniqueAdminCode();

      await db.collection("adminCodes").doc(code).set({
        code,
        createdAt: new Date(),
        createdBy: message.author.id,
        used: false,
      });

      const embed = new EmbedBuilder()
        .setTitle("Admin code generated!")
        .setDescription(
          `> You can use this code to access the closed platform.

          > Generated code: 
          \`\`\`${code}\`\`\``
        )
        .setColor(Config.embedColorSuccess)
        .setFooter({ text: Config.footerText })
        .setTimestamp();

      message.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Firebase Error:", error);
      message.reply("`❌` Failed to generate admin code.");
    }
  },
};
