const { Events } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`[INFO] Discord.js bot is ready!`.green);
    console.log(`[INFO] Logged in as ${client.user.tag}`.blue);

    client.user.setPresence({
      activities: [{ name: "Create your own bio!", type: 0 }], // Type 0 = "Playing"
      status: "online", // "online" | "idle" | "dnd" | "invisible"
    });

    const mongoURI = process.env.MONGO_URI;

    try {
      await mongoose.connect(mongoURI);
      console.log("[INFO] Connected to MongoDB!".green);
    } catch (e) {
      console.error(`[ERROR] Failed to connect to MongoDB: ${e}`.red);
    }
  },
};
