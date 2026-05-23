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
} from "../../controllers/analytics.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

const router = Router();

// Apply JWT verification globally — all analytics routes are protected
router.use(verifyJWT);

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC (any authenticated user)
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
// ADMIN ONLY — RBAC protected with authorizeRoles("admin")
// ─────────────────────────────────────────────────────────────────────────────

// Platform overview (admin sees user counts, admin count, system-wide stats)
router.get("/overview", authorizeRoles("admin"), getOverview);

// User growth analytics
router.get("/users/growth", authorizeRoles("admin"), getUserGrowth);

// Bookmark/interest stats
router.get("/bookmarks/stats", authorizeRoles("admin"), getBookmarkStats);

// System health monitoring
router.get("/system/health", authorizeRoles("admin"), getSystemHealth);

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY ROUTES — kept for backward compatibility with existing API consumers
// ─────────────────────────────────────────────────────────────────────────────
router.get("/overview-legacy", getOverview);
router.get("/top-gainers", getTopGainers);
router.get("/top-losers", getTopLosers);
router.get("/highest-marketcap", getHighestMarketCap);
router.get("/highest-volume", getHighestVolume);
router.get("/volatility/high", getHighVolatility);
router.get("/price-ranges", getPriceRanges);
router.get("/monthly-report", authorizeRoles("admin"), getMonthlyReport);
router.get("/yearly-report", authorizeRoles("admin"), getYearlyReport);
router.get("/market-summary", getMarketSummary);

export default router;
