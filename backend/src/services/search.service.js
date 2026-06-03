import SearchLog from "../models/SearchLog.js";
import Coin from "../models/Coin.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationOptions, getPaginationMeta } from "../utils/pagination.js";

/**
 * Execute search on coins and log the search query
 */
export const executeSearchAndLog = async (userId, queryParams) => {
  const { q } = queryParams;
  if (!q) {
    throw new ApiError(400, "Search query parameter 'q' is required");
  }

  // 1. Log search if userId is available (skip duplicate consecutive logs)
  if (userId) {
    try {
      const lastLog = await SearchLog.findOne({ user: userId }).sort({ createdAt: -1 });
      if (lastLog && lastLog.query.toLowerCase() === q.trim().toLowerCase()) {
        // Update timestamp of recent search
        lastLog.createdAt = new Date();
        await lastLog.save();
      } else {
        await SearchLog.create({
          user: userId,
          query: q.trim(),
        });
      }
    } catch (err) {
      console.error("Error logging search query:", err.message);
    }
  }

  // 2. Perform regular regex search on Coin model
  const query = {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { symbol: { $regex: q, $options: "i" } },
      { coinId: { $regex: q, $options: "i" } },
    ],
  };

  const { page, limit, skip } = getPaginationOptions(queryParams);

  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query)
    .sort({ rank: 1 })
    .skip(skip)
    .limit(limit);

  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};

/**
 * Get user's unique recent searches
 */
export const getRecentSearches = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "User ID is required to fetch search history");
  }

  // Fetch recent search logs
  const logs = await SearchLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(30);

  // In-memory unique queries extraction
  const uniqueSearches = [];
  const seenQueries = new Set();

  for (const log of logs) {
    const norm = log.query.toLowerCase();
    if (!seenQueries.has(norm)) {
      seenQueries.add(norm);
      uniqueSearches.push({
        id: log._id,
        query: log.query,
        timestamp: log.createdAt,
      });
    }
    if (uniqueSearches.length >= 10) break;
  }

  return uniqueSearches;
};

/**
 * Clear all recent searches for a user
 */
export const clearRecentSearches = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "User ID is required to clear search history");
  }

  await SearchLog.deleteMany({ user: userId });
  return true;
};

/**
 * Get globally trending search terms using Mongo aggregation
 */
export const getTrendingSearches = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;

  const trending = await SearchLog.aggregate([
    {
      $group: {
        _id: { $toLower: "$query" },
        count: { $sum: 1 },
        originalQuery: { $first: "$query" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        query: "$originalQuery",
        count: 1,
      },
    },
  ]);

  return trending;
};
