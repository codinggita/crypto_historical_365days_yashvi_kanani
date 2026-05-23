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
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimized lookup of user's recent searches
searchLogSchema.index({ user: 1, createdAt: -1 });

const SearchLog = mongoose.model("SearchLog", searchLogSchema);

export default SearchLog;
