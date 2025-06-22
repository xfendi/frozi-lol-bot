const { pricingMessage } = require("../../data/messages/pricing");

module.exports = {
  name: "pricing",
  description: "Displays the pricing information for platform",
  execute(message, args, client) {
    message.channel.send(pricingMessage);
  },
};
