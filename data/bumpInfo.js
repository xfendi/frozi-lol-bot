const { partnersInfoMessage } = require("./messages/partnersInfo");
const { pricingMessage } = require("./messages/pricing");
const { ticketMessage } = require("./messages/ticket");
const { partnershipsInfoMessage } = require("./messages/partnershipsInfo");

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
  {
    channelId: "1386397570703822858",
    message: partnershipsInfoMessage,
  },
];

module.exports = {
  bumpInfo,
  DEFAULT_REFRESH_INTERVAL,
};
