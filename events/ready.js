const { Events } = require("discord.js");
const mongoose = require("mongoose");

const { startBumpRefresher } = require("../scripts/bumpMessages");
const { HOURS_FOR_LAST_PARTNERSHIP } = require("../data/partnerships");

function scheduleDailyImplementersReminder(client) {
  const now = new Date();
  const millisTillMidnight =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) -
    now;

  setTimeout(function () {
    remindInactiveImplementers(client);

    setInterval(() => {
      remindInactiveImplementers(client);
    }, HOURS_FOR_LAST_PARTNERSHIP * 60 * 60 * 1000);
  }, millisTillMidnight);
}

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

    startBumpRefresher(client);
    scheduleDailyImplementersReminder(client);

    try {
      await mongoose.connect(mongoURI);
      console.log("[INFO] Connected to MongoDB!".green);
    } catch (e) {
      console.error(`[ERROR] Failed to connect to MongoDB: ${e}`.red);
    }
  },
};
