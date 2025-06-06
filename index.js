require("colors");
require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { TOKEN } = process.env;

const {
  Guilds,
  GuildMembers,
  GuildMessages,
  MessageContent,
  GuildBans,
  GuildVoiceStates,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const client = new Client({
  partials: [User, Message, GuildMember, ThreadMember, Channel],
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    MessageContent,
    GuildBans,
    GuildVoiceStates,
  ],
});

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");

commandHandler(client);
eventHandler(client);

client.login(TOKEN);
