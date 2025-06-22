const { partnersInfoMessage } = require("../../data/messages/partnersInfo");

module.exports = {
  name: "partners-info",
  description: "Displays information for partners",
  execute(message, args, client) {
    message.channel.send(partnersInfoMessage);
  },
};
