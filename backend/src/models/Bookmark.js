import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coin",
      required: true,
      index: true,
    },
    coinName: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    addedPrice: {
      type: Number,
      required: true,
      min: [0, "Added price cannot be negative"],
    },
    currentPrice: {
      type: Number,
      required: true,
      min: [0, "Current price cannot be negative"],
    },
    category: {
      type: String,
      trim: true,
      default: "watchlist",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent a user from bookmarking the same coin multiple times
bookmarkSchema.index({ user: 1, coin: 1 }, { unique: true });

// Index for search capabilities
bookmarkSchema.index({ coinName: "text", symbol: "text" });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
