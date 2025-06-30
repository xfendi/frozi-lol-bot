const mongoose = require("mongoose");

const ImplementerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    default: 0,
    min: 0,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastPayout: {
    type: Date,
  },
  lastAdvertisedAt: {
    type: Date,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  partnerships: {
    type: [
      {
        invite: {
          type: String,
          required: true,
          unique: false,
        },
        representiveId: {
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
    ],
  },
});

module.exports = mongoose.model("Implementer", ImplementerSchema);
