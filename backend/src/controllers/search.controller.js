import * as searchService from "../services/search.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Execute search on coins and log query in search history
 */
export const searchCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await searchService.executeSearchAndLog(
    req.user?._id,
    req.query
  );

  return res
    .status(200)
    .json(new ApiResponse(200, coins, "Search completed successfully", meta));
});

/**
 * Fetch authenticated user's recent unique searches
 */
export const getRecentSearches = asyncHandler(async (req, res) => {
  const recent = await searchService.getRecentSearches(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, recent, "Recent searches retrieved successfully"));
});

/**
 * Clear authenticated user's search history
 */
export const clearRecentSearches = asyncHandler(async (req, res) => {
  await searchService.clearRecentSearches(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Search history cleared successfully"));
});

/**
 * Get globally trending search queries
 */
export const getTrendingSearches = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const trending = await searchService.getTrendingSearches(limit);

  return res
    .status(200)
    .json(new ApiResponse(200, trending, "Trending search terms fetched successfully"));
});
