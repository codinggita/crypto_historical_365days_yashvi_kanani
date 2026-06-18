import { Router } from "express";
import {
  getOverview,
  getMarketSummary,
  getTopGainers,
  getTopLosers,
  getTrendingCoins,
  getUserGrowth,
  getSearchTrends,
  getBookmarkStats,
  getCategoryDistribution,
  getSystemHealth,
  getDashboard,
  getHighestMarketCap,
  getHighestVolume,
  getHighVolatility,
  getMonthlyReport,
  getYearlyReport,
  getPriceRanges,
  getHighestPrice,
  getLowestPrice,
  getAveragePrice,
  getPriceHistory,
  getPriceTrend,
  getPriceGrowth,
  getPriceDrop,
  getHighestVolumeCoin,
  getLowestVolume,
  getAverageVolume,
  getVolumeSpike,
  getTopReturns,
  getNegativeReturns,
  getCumulativeReturns,
  getHighVolatilityCoins,
} from "../../controllers/analytics.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

const router = Router();

// All analytics endpoints are public (no authentication required)
// HEAD route for highest price analytics
router.head("/price/highest", (req, res) => {
  res.set("X-Highest-Price-Analytics", "true");
  res.status(200).end();
});

// Price analytics routes
router.get("/price/highest", getHighestPrice);
router.get("/price/lowest", getLowestPrice);
router.get("/price/average", getAveragePrice);
router.get("/price/history/:coinId", getPriceHistory);
router.get("/price/trend", getPriceTrend);
router.get("/price/growth", getPriceGrowth);
router.get("/price/drop", getPriceDrop);

// Volume analytics routes
router.get("/volume/highest", getHighestVolumeCoin);
router.get("/volume/lowest", getLowestVolume);
router.get("/volume/average", getAverageVolume);
router.get("/volume/spike", getVolumeSpike);

// Returns analytics routes
router.get("/returns/top", getTopReturns);
router.get("/returns/negative", getNegativeReturns);
router.get("/returns/cumulative", getCumulativeReturns);

// Volatility analytics routes
router.get("/volatility/high", getHighVolatilityCoins);

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// Master dashboard — combines all analytics in a single call
router.get("/dashboard", getDashboard);

// Coin analytics
router.get("/coins/top-gainers", getTopGainers);
router.get("/coins/top-losers", getTopLosers);
router.get("/coins/trending", getTrendingCoins);

// Search trend analytics
router.get("/search/trends", getSearchTrends);

// Market analytics
router.get("/market/summary", getMarketSummary);
router.get("/market/category-distribution", getCategoryDistribution);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ONLY — RBAC protected with verifyJWT + authorizeRoles("admin")
// ─────────────────────────────────────────────────────────────────────────────

// Platform overview (admin sees user counts, admin count, system-wide stats)
router.get("/overview", verifyJWT, authorizeRoles("admin"), getOverview);

// User growth analytics
router.get("/users/growth", verifyJWT, authorizeRoles("admin"), getUserGrowth);

// Bookmark/interest stats
router.get("/bookmarks/stats", verifyJWT, authorizeRoles("admin"), getBookmarkStats);

// System health monitoring
router.get("/system/health", verifyJWT, authorizeRoles("admin"), getSystemHealth);

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY ROUTES — kept for backward compatibility with existing API consumers
// ─────────────────────────────────────────────────────────────────────────────
router.get("/overview-legacy", getOverview);
router.get("/top-gainers", getTopGainers);
router.get("/top-losers", getTopLosers);
router.get("/highest-marketcap", getHighestMarketCap);
router.get("/highest-volume", getHighestVolume);
router.get("/volatility/high-legacy", getHighVolatility);
router.get("/price-ranges", getPriceRanges);
router.get("/monthly-report", verifyJWT, authorizeRoles("admin"), getMonthlyReport);
router.get("/yearly-report", verifyJWT, authorizeRoles("admin"), getYearlyReport);
router.get("/market-summary", getMarketSummary);

export default router;
