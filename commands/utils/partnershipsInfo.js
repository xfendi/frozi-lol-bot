const {
  partnershipsInfoMessage,
} = require("../../data/messages/partnershipsInfo");

module.exports = {
  name: "partnerships-info",
  description: "Displays information for partnerships",
  execute(message, args, client) {
    message.channel.send(partnershipsInfoMessage);
  },
};
