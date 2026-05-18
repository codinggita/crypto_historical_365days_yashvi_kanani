import mongoose from "mongoose";

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
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      default: 0,
      index: true,
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
    year: {
      type: Number,
      index: true,
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

coinSchema.index({ coinId: 1 }, { unique: true });
coinSchema.index({ name: "text", symbol: "text" });

const Coin = mongoose.model("Coin", coinSchema);

export default Coin;
