const { ticketMessage } = require("../../data/messages/ticket");

module.exports = {
  name: "ticket",
  description: "Send the ticket menu.",
  async execute(message, args, client) {
    message.channel.send(ticketMessage);
  },
};
