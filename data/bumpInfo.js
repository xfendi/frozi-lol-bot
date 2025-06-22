const { partnersInfoMessage } = require("./messages/partnersInfo");
const { pricingMessage } = require("./messages/pricing");
const { ticketMessage } = require("./messages/ticket");

const DEFAULT_REFRESH_INTERVAL = 1000 * 60 * 60; // 1 hour

const bumpInfo = [
  {
    channelId: "1382349136858185788",
    message: partnersInfoMessage,
  },
  {
    channelId: "1380611268364341349",
    message: pricingMessage,
  },
  {
    channelId: "1380404393471512619",
    message: ticketMessage,
  },
];

module.exports = {
  bumpInfo,
  DEFAULT_REFRESH_INTERVAL,
};
