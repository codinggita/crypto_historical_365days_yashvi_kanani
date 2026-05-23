import mongoose from "mongoose";

const coinSchema = new mongoose.Schema(
  {
    coinId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
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
      index: true,
    },
    dailyReturn: {
      type: Number,
      default: 0,
      index: true,
    },
    volatility: {
      type: Number,
      default: 0,
    },
    circulatingSupply: {
      type: Number,
      default: 0,
    },
    totalSupply: {
      type: Number,
      default: 0,
    },
    maxSupply: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      trim: true,
    },
    marketStatus: {
      type: String,
      trim: true,
      default: "active",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
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

// Compound text index for global search support
coinSchema.index({ name: "text", symbol: "text", tags: "text" });

const Coin = mongoose.model("Coin", coinSchema);

export default Coin;
