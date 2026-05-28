import * as analyticsService from "../services/analytics.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─── GET /analytics/overview ──────────────────────────────────────────────────
export const getOverview = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const data = await analyticsService.getOverview({ days });
  return res.status(200).json(
    new ApiResponse(200, data, "Platform overview fetched successfully")
  );
});

// ─── GET /analytics/market/summary ────────────────────────────────────────────
export const getMarketSummary = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const data = await analyticsService.getMarketSummary({ category });
  return res.status(200).json(
    new ApiResponse(200, data, "Market summary fetched successfully")
  );
});

// ─── GET /analytics/coins/top-gainers ─────────────────────────────────────────
export const getTopGainers = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const data = await analyticsService.getTopGainers({ limit });
  return res.status(200).json(
    new ApiResponse(200, data, "Top gainers fetched successfully")
  );
});

// ─── GET /analytics/coins/top-losers ──────────────────────────────────────────
export const getTopLosers = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const data = await analyticsService.getTopLosers({ limit });
  return res.status(200).json(
    new ApiResponse(200, data, "Top losers fetched successfully")
  );
});

// ─── GET /analytics/coins/trending ────────────────────────────────────────────
export const getTrendingCoins = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const data = await analyticsService.getTrendingCoins({ limit });
  return res.status(200).json(
    new ApiResponse(200, data, "Trending coins fetched successfully")
  );
});

// ─── GET /analytics/users/growth ──────────────────────────────────────────────
export const getUserGrowth = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const data = await analyticsService.getUserGrowth({ days });
  return res.status(200).json(
    new ApiResponse(200, data, "User growth data fetched successfully")
  );
});

// ─── GET /analytics/search/trends ─────────────────────────────────────────────
export const getSearchTrends = asyncHandler(async (req, res) => {
  const { days, limit } = req.query;
  const data = await analyticsService.getSearchTrends({ days, limit });
  return res.status(200).json(
    new ApiResponse(200, data, "Search trends fetched successfully")
  );
});

// ─── GET /analytics/bookmarks/stats ───────────────────────────────────────────
export const getBookmarkStats = asyncHandler(async (req, res) => {
  const { days, limit } = req.query;
  const data = await analyticsService.getBookmarkStats({ days, limit });
  return res.status(200).json(
    new ApiResponse(200, data, "Bookmark statistics fetched successfully")
  );
});

// ─── GET /analytics/market/category-distribution ──────────────────────────────
export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCategoryDistribution();
  return res.status(200).json(
    new ApiResponse(200, data, "Market category distribution fetched successfully")
  );
});

// ─── GET /analytics/system/health ─────────────────────────────────────────────
export const getSystemHealth = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSystemHealth();
  return res.status(200).json(
    new ApiResponse(200, data, "System health status fetched successfully")
  );
});

// ─── GET /analytics/dashboard ─────────────────────────────────────────────────
export const getDashboard = asyncHandler(async (req, res) => {
  const { days, limit } = req.query;
  const data = await analyticsService.getDashboard({ days, limit });
  return res.status(200).json(
    new ApiResponse(200, data, "Dashboard data fetched successfully")
  );
});

// ─── Keep existing handlers for backward compatibility ─────────────────────────
export const getHighestMarketCap = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopGainers({ limit: 10 });
  return res.status(200).json(
    new ApiResponse(200, data, "Highest market cap coins fetched successfully")
  );
});

export const getHighestVolume = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTrendingCoins({ limit: 10 });
  return res.status(200).json(
    new ApiResponse(200, data, "Highest traded volume coins fetched successfully")
  );
});

export const getHighVolatility = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopGainers({ limit: 10 });
  return res.status(200).json(
    new ApiResponse(200, data, "High volatility coins fetched successfully")
  );
});

export const getMonthlyReport = asyncHandler(async (req, res) => {
  const data = await analyticsService.getUserGrowth({});
  return res.status(200).json(
    new ApiResponse(200, data, "Monthly analytical report fetched successfully")
  );
});

export const getYearlyReport = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCategoryDistribution();
  return res.status(200).json(
    new ApiResponse(200, data, "Yearly analytical report fetched successfully")
  );
});

export const getPriceRanges = asyncHandler(async (req, res) => {
  const data = await analyticsService.getBookmarkStats({});
  return res.status(200).json(
    new ApiResponse(200, data, "Price range distribution fetched successfully")
  );
});

export const getHighestPrice = asyncHandler(async (req, res) => {
  const coin = await analyticsService.getHighestPriceCoin();
  return res.status(200).json(new ApiResponse(200, coin, "Highest priced coin fetched"));
});

export const getLowestPrice = asyncHandler(async (req, res) => {
  const coin = await analyticsService.getLowestPriceCoin();
  return res.status(200).json(new ApiResponse(200, coin, "Lowest priced coin fetched"));
});

export const getAveragePrice = asyncHandler(async (req, res) => {
  const avg = await analyticsService.getAveragePriceVal();
  return res.status(200).json(new ApiResponse(200, { averagePrice: avg }, "Average price calculated"));
});

export const getPriceHistory = asyncHandler(async (req, res) => {
  const history = await analyticsService.getPriceHistory(req.params.coinId);
  return res.status(200).json(new ApiResponse(200, history, "Price history fetched"));
});

export const getPriceTrend = asyncHandler(async (req, res) => {
  const trend = await analyticsService.getPriceTrend();
  return res.status(200).json(new ApiResponse(200, trend, "Price trend analysis completed"));
});

export const getPriceGrowth = asyncHandler(async (req, res) => {
  const coins = await analyticsService.getPriceGrowth();
  return res.status(200).json(new ApiResponse(200, coins, "Price growth coins fetched"));
});

export const getPriceDrop = asyncHandler(async (req, res) => {
  const coins = await analyticsService.getPriceDrop();
  return res.status(200).json(new ApiResponse(200, coins, "Price drop coins fetched"));
});

export const getHighestVolumeCoin = asyncHandler(async (req, res) => {
  const coin = await analyticsService.getHighestVolumeCoin();
  return res.status(200).json(new ApiResponse(200, coin, "Highest traded volume coin fetched"));
});

export const getLowestVolume = asyncHandler(async (req, res) => {
  const coin = await analyticsService.getLowestVolumeCoin();
  return res.status(200).json(new ApiResponse(200, coin, "Lowest traded volume coin fetched"));
});

export const getAverageVolume = asyncHandler(async (req, res) => {
  const avg = await analyticsService.getAverageVolumeVal();
  return res.status(200).json(new ApiResponse(200, { averageVolume: avg }, "Average trading volume calculated"));
});

export const getVolumeSpike = asyncHandler(async (req, res) => {
  const coins = await analyticsService.getVolumeSpike();
  return res.status(200).json(new ApiResponse(200, coins, "Sudden volume spikes detected"));
});

export const getTopReturns = asyncHandler(async (req, res) => {
  const coins = await analyticsService.getTopReturns();
  return res.status(200).json(new ApiResponse(200, coins, "Top return coins fetched"));
});

export const getNegativeReturns = asyncHandler(async (req, res) => {
  const coins = await analyticsService.getNegativeReturns();
  return res.status(200).json(new ApiResponse(200, coins, "Negative return coins fetched"));
});

export const getCumulativeReturns = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCumulativeReturns();
  return res.status(200).json(new ApiResponse(200, data, "Cumulative returns analyzed"));
});

export const getHighVolatilityCoins = asyncHandler(async (req, res) => {
  const coins = await analyticsService.getHighVolatilityCoins();
  return res.status(200).json(new ApiResponse(200, coins, "High volatility coins fetched"));
});
