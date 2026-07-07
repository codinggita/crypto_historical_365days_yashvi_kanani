import { Router } from "express";
import {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  replaceCoin,
  deleteCoin,
  getTrendingCoins,
  getTopGainers,
  getTopLosers,
  getMarketSummary,
  getGlobalSearch,
  getRecentCoins,
  getRandomCoin,
  checkCoinExists,
  bulkCreateCoins,
  bulkUpdateCoins,
  bulkDeleteCoins,
  getCoinByName,
  getCoinBySymbol,
  getCoinsByRank,
  getCoinsByMonth,
  getCoinsByDate,
  getLatestCoins,
  getCoinHistory,
  getCoinHistoryByMonth,
  getTopMarketCapCoins,
  getTopVolumeCoins,
  getOldestCoins,
  getNewestCoins,
  getCoinPerformance,
  getCoinVolatility,
  getCoinMarketCapDetails,
  getCoinVolumeDetails,
  getCoinReturns,
  compareCoins,
  getCoinPriceOnly,
  filterCoins,
  getRecommendations,
  getPredictions,
  getHeatmapData,
  getMarketStatusDetails,
  getTopMonthlyPerformers,
  getTopYearlyPerformers,
  getVolatilityAlerts,
  getMarketDropAlerts,
  submitReport,
  clearCache,
  getSystemHealth,
  getSystemVersion,
  getSystemConfig,
} from "../../controllers/coin.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";

const marketCache = cacheMiddleware(60);
import {
  createCoinValidator,
  updateCoinValidator,
  queryCoinValidator,
  searchCoinValidator,
} from "../../validators/coin.validator.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS & Public Methods (Registered BEFORE verifyJWT middleware to bypass auth)
// ─────────────────────────────────────────────────────────────────────────────
router.options("/", (req, res) => {
  res.set("Allow", "GET, POST, HEAD, OPTIONS");
  res.status(200).end();
});

router.options("/system/health", (req, res) => {
  res.set("Allow", "GET, HEAD, OPTIONS");
  res.status(200).end();
});

router.options("/:id", (req, res) => {
  res.set("Allow", "GET, PUT, PATCH, DELETE, HEAD, OPTIONS");
  res.status(200).end();
});

// HEAD check status for health endpoint
router.head("/system/health", (req, res) => {
  res.set("X-System-Health", "OK");
  res.status(200).end();
});

// HEAD endpoint for collections
router.head("/", (req, res) => {
  res.set("X-Total-Coins-Count", "100");
  res.status(200).end();
});

// ─────────────────────────────────────────────────────────────────────────────
// Public Routes (No authentication required)
// ─────────────────────────────────────────────────────────────────────────────

// Specific named / parameterless endpoints first to avoid parameter collision
router.route("/latest").get(getLatestCoins);
router.route("/oldest").get(getOldestCoins);
router.route("/newest").get(getNewestCoins);
router.route("/trending").get(marketCache, getTrendingCoins);
router.route("/recent").get(getRecentCoins);
router.route("/random").get(getRandomCoin);

router.route("/top-market-cap").get(getTopMarketCapCoins);
router.route("/top-volume").get(getTopVolumeCoins);
router.route("/top-gainers").get(marketCache, getTopGainers);
router.route("/top-losers").get(marketCache, getTopLosers);

router.route("/recommendations").get(getRecommendations);
router.route("/predictions").get(getPredictions);
router.route("/heatmap").get(getHeatmapData);
router.route("/market-status").get(getMarketStatusDetails);

router.route("/market/summary").get(marketCache, getMarketSummary);
router.route("/search/global").get(searchCoinValidator(), getGlobalSearch);

// Performance / Alerts
router.route("/performance/top-monthly").get(getTopMonthlyPerformers);
router.route("/performance/top-yearly").get(getTopYearlyPerformers);
router.route("/alerts/high-volatility").get(getVolatilityAlerts);
router.route("/alerts/market-drop").get(getMarketDropAlerts);

// System endpoints
router.route("/cache/clear").get(clearCache);
router.route("/system/health").get(getSystemHealth);
router.route("/system/version").get(getSystemVersion);
router.route("/system/config").get(getSystemConfig);
router.route("/report").post(submitReport);

// ─────────────────────────────────────────────────────────────────────────────
// Admin Protected Routes (JWT + Admin Role required)
// ─────────────────────────────────────────────────────────────────────────────

// Bulk operations
router.route("/bulk-create").post(verifyJWT, authorizeRoles("admin"), bulkCreateCoins);
router.route("/bulk-update").patch(verifyJWT, authorizeRoles("admin"), bulkUpdateCoins);
router.route("/bulk-delete").delete(verifyJWT, authorizeRoles("admin"), bulkDeleteCoins);

// Existence checks
router.route("/exists/:id").get(checkCoinExists);

// Specific detail endpoints by name / symbol / rank
router.route("/name/:coinName").get(getCoinByName);
router.route("/symbol/:symbol").get(getCoinBySymbol);
router.route("/rank/:rank").get(getCoinsByRank);

// Date & Time query parameters / route parameters
router.route("/month/:month").get(getCoinsByMonth);
router.route("/date/:date").get(getCoinsByDate);

// Sorting custom endpoints
router.route("/sort/price-asc").get((req, res, next) => { req.query.sortBy = "price"; req.query.sortOrder = "asc"; next(); }, getAllCoins);
router.route("/sort/price-desc").get((req, res, next) => { req.query.sortBy = "price"; req.query.sortOrder = "desc"; next(); }, getAllCoins);
router.route("/sort/volume-desc").get((req, res, next) => { req.query.sortBy = "volume"; req.query.sortOrder = "desc"; next(); }, getAllCoins);
router.route("/sort/rank-asc").get((req, res, next) => { req.query.sortBy = "rank"; req.query.sortOrder = "asc"; next(); }, getAllCoins);
router.route("/sort/return-desc").get((req, res, next) => { req.query.sortBy = "dailyReturn"; req.query.sortOrder = "desc"; next(); }, getAllCoins);

// Filtering endpoints
router.route("/filter/high-price").get((req, res, next) => { req.params.criteria = "high-price"; next(); }, filterCoins);
router.route("/filter/low-price").get((req, res, next) => { req.params.criteria = "low-price"; next(); }, filterCoins);
router.route("/filter/high-volume").get((req, res, next) => { req.params.criteria = "high-volume"; next(); }, filterCoins);
router.route("/filter/low-volume").get((req, res, next) => { req.params.criteria = "low-volume"; next(); }, filterCoins);
router.route("/filter/high-market-cap").get((req, res, next) => { req.params.criteria = "high-market-cap"; next(); }, filterCoins);
router.route("/filter/low-market-cap").get((req, res, next) => { req.params.criteria = "low-market-cap"; next(); }, filterCoins);
router.route("/filter/high-volatility").get((req, res, next) => { req.params.criteria = "high-volatility"; next(); }, filterCoins);
router.route("/filter/low-volatility").get((req, res, next) => { req.params.criteria = "low-volatility"; next(); }, filterCoins);
router.route("/filter/high-return").get((req, res, next) => { req.params.criteria = "high-return"; next(); }, filterCoins);
router.route("/filter/negative-return").get((req, res, next) => { req.params.criteria = "negative-return"; next(); }, filterCoins);
router.route("/filter/bullish").get((req, res, next) => { req.params.criteria = "bullish"; next(); }, filterCoins);
router.route("/filter/bearish").get((req, res, next) => { req.params.criteria = "bearish"; next(); }, filterCoins);
router.route("/filter/profitable").get((req, res, next) => { req.params.criteria = "profitable"; next(); }, filterCoins);
router.route("/filter/loss-making").get((req, res, next) => { req.params.criteria = "loss-making"; next(); }, filterCoins);
router.route("/filter/missing-values").get((req, res, next) => { req.params.criteria = "missing-values"; next(); }, filterCoins);

// Comparison endpoints (Compare 2 or 3 coins)
router.route("/compare/:coin1/:coin2").get(compareCoins);
router.route("/compare/:coin1/:coin2/:coin3").get(compareCoins);

// Coin specific details (volatility, volume, market-cap, returns, price, portfolio simulate)
router.route("/performance/:coinId").get(getCoinPerformance);
router.route("/volatility/:coinId").get(getCoinVolatility);
router.route("/market-cap/:coinId").get(getCoinMarketCapDetails);
router.route("/volume/:coinId").get(getCoinVolumeDetails);
router.route("/returns/:coinId").get(getCoinReturns);
router.route("/price/:coinId").get(getCoinPriceOnly);
router.route("/portfolio/simulate").get((req, res) => {
  // Simple simulation route
  res.json({
    success: true,
    message: "Investment simulation calculated",
    simulatedValue: 5000,
  });
});

// Historical queries (complete history, monthly history)
router.route("/history/:coinId")
  .head((req, res) => {
    res.set("X-Historical-Available", "true");
    res.status(200).end();
  })
  .get(getCoinHistory);

router.route("/history/:coinId/:month").get(getCoinHistoryByMonth);

// Collection routes
router
  .route("/")
  .get(queryCoinValidator(), getAllCoins)
  .post(verifyJWT, authorizeRoles("admin"), createCoinValidator(), createCoin);

// Resource routes with dynamic id parameter
router
  .route("/:id")
  .head((req, res) => {
    res.set("X-Coin-Details-Available", "true");
    res.status(200).end();
  })
  .get(getCoinById)
  .patch(verifyJWT, authorizeRoles("admin"), updateCoinValidator(), updateCoin)
  .put(verifyJWT, authorizeRoles("admin"), createCoinValidator(), replaceCoin)
  .delete(verifyJWT, authorizeRoles("admin"), deleteCoin);

export default router;
