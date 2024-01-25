const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const playerSchema = new Schema({
  HP: {
    type: Number,
    default: 100,
  },
  manaPool: {
    type: Number,
    default: 3,
  },
  Gold: {
    type: Number,
    default: 0,
  },
  DeckOfCards: [
    {
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  levelReached: {
    type: Number,
    default: 1,
  },
  emailUser: {
    type: String,
    ref: "User",
  },
});

module.exports = mongoose.model("Player", playerSchema, "players");
