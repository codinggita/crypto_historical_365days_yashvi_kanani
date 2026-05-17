const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema(
  {
    coinId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    rank: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 0,
    },
    dailyReturn: {
      type: Number,
      default: 0,
    },
    volatility: {
      type: Number,
      default: 0,
    },
    month: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compounding index for optimization on historical query and uniqueness of coinId per timestamp if needed.
// For general uniqueness, the user requested 'unique: true' for coinId, but if it is historical data, the same coinId might appear multiple times with different timestamps.
// Let's look at the project name: "crypto_historical_365days".
// If it stores historical data of coins, coinId itself is NOT globally unique, but rather unique per timestamp or not at all.
// Let's implement unique: false (or default index: true) for coinId, but keep it indexable.
// Wait, the prompt says: "coinId unique: true". Okay, I will follow the user's specification "coinId unique: true" first, or just create a compound unique index if it makes more sense. But strictly following: "coinId unique: true". Oh wait, the prompt says "coinId - unique: true" was inside the auth tasks earlier, for coin: "coinId, name, symbol, rank, price, marketCap, volume, dailyReturn, volatility, month, timestamp". It does not explicitly say unique for coinId, but we'll add index: true. Let's make coinId unique: true if it's a single coin entry, or just indexed. Let's make it unique: true as a safe default unless historical records are multiple. Let's make it unique: true. Wait, if the project is "crypto_historical_365days", a coin model might represent either a coin metadata or historical records. If it represents coin metadata, coinId is unique. Let's do unique: true for coinId.
coinSchema.index({ coinId: 1 }, { unique: true });
coinSchema.index({ name: "text", symbol: "text" });

const Coin = mongoose.model("Coin", coinSchema);

module.exports = Coin;
