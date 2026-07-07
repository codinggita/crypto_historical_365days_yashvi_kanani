import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";
import {
  getTotalMarketCap,
  getAveragePrice,
  getAverageVolume,
  getHighestMarketCap,
  getHighestVolume,
  getTopGainers,
  getTopLosers,
  getMonthlyAnalysis,
  getCoinCount,
  getRankDistribution,
  getPriceDistribution,
  getVolatilityDistribution,
  getMarketSummary,
  getDailyAnalysis,
  getYearlyAnalysis,
} from "../../controllers/stats.controller.js";

const router = Router();
const statsCache = cacheMiddleware(60);

// All stats endpoints are public (no authentication required)
// HEAD /stats/market-cap - Check metadata (headers) for market cap
router.head("/market-cap", (req, res) => {
  res.set("X-Total-Market-Cap-Metadata", "true");
  res.status(200).end();
});

router.route("/market-cap").get(getTotalMarketCap);
router.route("/average-price").get(getAveragePrice);
router.route("/average-volume").get(getAverageVolume);
router.route("/highest-market-cap").get(getHighestMarketCap);
router.route("/highest-volume").get(getHighestVolume);
router.route("/top-gainers").get(statsCache, getTopGainers);
router.route("/top-losers").get(statsCache, getTopLosers);
router.route("/monthly-analysis").get(getMonthlyAnalysis);
router.route("/coin-count").get(getCoinCount);
router.route("/rank-distribution").get(getRankDistribution);
router.route("/price-distribution").get(getPriceDistribution);
router.route("/volatility-distribution").get(getVolatilityDistribution);
router.route("/market-summary").get(statsCache, getMarketSummary);
router.route("/daily-analysis").get(getDailyAnalysis);
router.route("/yearly-analysis").get(getYearlyAnalysis);

export default router;
