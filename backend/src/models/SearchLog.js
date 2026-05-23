import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    resultsCount: {
      type: Number,
      default: 0,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    category: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

searchLogSchema.index({ createdAt: -1 });
searchLogSchema.index({ query: 1, createdAt: -1 });
searchLogSchema.index({ user: 1, createdAt: -1 });

const SearchLog = mongoose.model("SearchLog", searchLogSchema);

export default SearchLog;
