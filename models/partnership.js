const mongoose = require("mongoose");

const PartnershipSchema = new mongoose.Schema({
  lastImplementerId: {
    type: String,
    required: true,
    unique: true,
  },
  lastRepresentativeId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
