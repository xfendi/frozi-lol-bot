const mongoose = require("mongoose");

const PartnershipSchema = new mongoose.Schema({
  messages: {
    type: [
      {
        implementerId: {
          type: String,
          required: true,
          unique: false,
        },
        representativeId: {
          type: String,
          required: true,
          unique: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        messageId: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ]
  },
  lastAdvertisedAt: {
    type: Date,
    default: Date.now,
  },
  invite: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Partnership", PartnershipSchema);
