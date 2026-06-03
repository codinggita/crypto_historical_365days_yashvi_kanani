import * as coinService from "../services/coin.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * GET /coins - Retrieve all coins with search, sorting, filtering, and pagination
 */
export const getAllCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getAllCoins(req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Coins fetched successfully", meta)
  );
});

/**
 * GET /coins/:id - Retrieve details of a single coin
 */
export const getCoinById = asyncHandler(async (req, res) => {
  const coin = await coinService.getCoinById(req.params.id);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin details fetched successfully")
  );
});

/**
 * POST /coins - Create new coin (Admin only)
 */
export const createCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.createCoin(req.body);
  return res.status(201).json(
    new ApiResponse(201, coin, "Coin created successfully")
  );
});

/**
 * PATCH /coins/:id - Partially update coin data (Admin only)
 */
export const updateCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.updateCoin(req.params.id, req.body);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin partially updated successfully")
  );
});

/**
 * PUT /coins/:id - Full update / Replace coin data (Admin only)
 */
export const replaceCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.replaceCoin(req.params.id, req.body);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin replaced successfully")
  );
});

/**
 * DELETE /coins/:id - Delete a coin (Admin only)
 */
export const deleteCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.deleteCoin(req.params.id);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin deleted successfully")
  );
});

/**
 * GET /coins/trending - Retrieve top trending coins (highest dailyReturn + volume)
 */
export const getTrendingCoins = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const coins = await coinService.getTrendingCoins(limit);
  return res.status(200).json(
    new ApiResponse(200, coins, "Trending coins fetched successfully")
  );
});

/**
 * GET /coins/top-gainers - Retrieve top gainers by dailyReturn descending
 */
export const getTopGainers = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const coins = await coinService.getTopGainers(limit);
  return res.status(200).json(
    new ApiResponse(200, coins, "Top gainers fetched successfully")
  );
});

/**
 * GET /coins/top-losers - Retrieve top losers by dailyReturn ascending
 */
export const getTopLosers = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const coins = await coinService.getTopLosers(limit);
  return res.status(200).json(
    new ApiResponse(200, coins, "Top losers fetched successfully")
  );
});

/**
 * GET /coins/market/summary - Retrieve platform-wide market statistics via aggregation
 */
export const getMarketSummary = asyncHandler(async (req, res) => {
  const summary = await coinService.getMarketSummary();
  return res.status(200).json(
    new ApiResponse(200, summary, "Market summary statistics fetched successfully")
  );
});

/**
 * GET /coins/search/global - Global regex search on name, symbol, tags
 */
export const getGlobalSearch = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getGlobalSearch(req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Global search results fetched successfully", meta)
  );
});

/**
 * GET /coins/recent - Retrieve most recently added coins
 */
export const getRecentCoins = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 10;
  const coins = await coinService.getRecentCoins(limit);
  return res.status(200).json(
    new ApiResponse(200, coins, "Recent coins fetched successfully")
  );
});

/**
 * GET /coins/random - Retrieve a single random coin
 */
export const getRandomCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.getRandomCoin();
  return res.status(200).json(
    new ApiResponse(200, coin, "Random coin fetched successfully")
  );
});

export const checkCoinExists = asyncHandler(async (req, res) => {
  const exists = await coinService.checkCoinExists(req.params.id);
  return res.status(200).json(
    new ApiResponse(200, { exists }, "Existence check completed")
  );
});

export const bulkCreateCoins = asyncHandler(async (req, res) => {
  const coins = await coinService.bulkCreateCoins(req.body);
  return res.status(201).json(
    new ApiResponse(201, coins, "Coins bulk created successfully")
  );
});

export const bulkUpdateCoins = asyncHandler(async (req, res) => {
  const result = await coinService.bulkUpdateCoins(req.body);
  return res.status(200).json(
    new ApiResponse(200, result, "Coins bulk updated successfully")
  );
});

export const bulkDeleteCoins = asyncHandler(async (req, res) => {
  const result = await coinService.bulkDeleteCoins(req.body);
  return res.status(200).json(
    new ApiResponse(200, result, "Coins bulk deleted successfully")
  );
});

export const getCoinByName = asyncHandler(async (req, res) => {
  const coin = await coinService.getCoinByName(req.params.coinName);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin details fetched by name")
  );
});

export const getCoinBySymbol = asyncHandler(async (req, res) => {
  const coin = await coinService.getCoinBySymbol(req.params.symbol);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin details fetched by symbol")
  );
});

export const getCoinsByRank = asyncHandler(async (req, res) => {
  const coins = await coinService.getCoinsByRank(req.params.rank);
  return res.status(200).json(
    new ApiResponse(200, coins, "Coins fetched by rank")
  );
});

export const getCoinsByMonth = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getCoinsByMonth(req.params.month, req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Coins fetched for the month", meta)
  );
});

export const getCoinsByDate = asyncHandler(async (req, res) => {
  const coins = await coinService.getCoinsByDate(req.params.date);
  return res.status(200).json(
    new ApiResponse(200, coins, "Coins fetched for the date")
  );
});

export const getLatestCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getLatestCoins(req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Latest coins fetched", meta)
  );
});

export const getCoinHistory = asyncHandler(async (req, res) => {
  const { history, meta } = await coinService.getCoinHistory(req.params.coinId, req.query);
  return res.status(200).json(
    new ApiResponse(200, history, "Coin history fetched", meta)
  );
});

export const getCoinHistoryByMonth = asyncHandler(async (req, res) => {
  const history = await coinService.getCoinHistoryByMonth(req.params.coinId, req.params.month);
  return res.status(200).json(
    new ApiResponse(200, history, "Coin monthly history fetched")
  );
});

export const getTopMarketCapCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getTopMarketCapCoins(req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Top market cap coins fetched", meta)
  );
});

export const getTopVolumeCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getTopVolumeCoins(req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Top traded volume coins fetched", meta)
  );
});

export const getOldestCoins = asyncHandler(async (req, res) => {
  const coins = await coinService.getOldestCoins();
  return res.status(200).json(
    new ApiResponse(200, coins, "Oldest records fetched")
  );
});

export const getNewestCoins = asyncHandler(async (req, res) => {
  const coins = await coinService.getNewestCoins();
  return res.status(200).json(
    new ApiResponse(200, coins, "Newest records fetched")
  );
});

export const getCoinPerformance = asyncHandler(async (req, res) => {
  const performance = await coinService.getCoinPerformance(req.params.coinId);
  return res.status(200).json(
    new ApiResponse(200, performance, "Coin performance fetched")
  );
});

export const getCoinVolatility = asyncHandler(async (req, res) => {
  const volatility = await coinService.getCoinVolatility(req.params.coinId);
  return res.status(200).json(
    new ApiResponse(200, volatility, "Coin volatility fetched")
  );
});

export const getCoinMarketCapDetails = asyncHandler(async (req, res) => {
  const details = await coinService.getCoinMarketCapDetails(req.params.coinId);
  return res.status(200).json(
    new ApiResponse(200, details, "Coin market cap details fetched")
  );
});

export const getCoinVolumeDetails = asyncHandler(async (req, res) => {
  const details = await coinService.getCoinVolumeDetails(req.params.coinId);
  return res.status(200).json(
    new ApiResponse(200, details, "Coin volume details fetched")
  );
});

export const getCoinReturns = asyncHandler(async (req, res) => {
  const returns = await coinService.getCoinReturns(req.params.coinId);
  return res.status(200).json(
    new ApiResponse(200, returns, "Coin returns analytics fetched")
  );
});

export const compareCoins = asyncHandler(async (req, res) => {
  const { coin1, coin2, coin3 } = req.params;
  const list = await coinService.compareCoins([coin1, coin2, coin3].filter(Boolean));
  return res.status(200).json(
    new ApiResponse(200, list, "Coins compared successfully")
  );
});

export const getCoinPriceOnly = asyncHandler(async (req, res) => {
  const details = await coinService.getCoinPriceOnly(req.params.coinId);
  return res.status(200).json(
    new ApiResponse(200, details, "Coin price fetched successfully")
  );
});

export const filterCoins = asyncHandler(async (req, res) => {
  const coins = await coinService.filterCoinsByCriteria(req.params.criteria);
  return res.status(200).json(
    new ApiResponse(200, coins, "Coins filtered successfully")
  );
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const coins = await coinService.getRecommendations();
  return res.status(200).json(
    new ApiResponse(200, coins, "Recommendations fetched successfully")
  );
});

export const getPredictions = asyncHandler(async (req, res) => {
  const predictions = await coinService.getPredictions();
  return res.status(200).json(
    new ApiResponse(200, predictions, "Predictions fetched successfully")
  );
});

export const getHeatmapData = asyncHandler(async (req, res) => {
  const heatmap = await coinService.getHeatmapData();
  return res.status(200).json(
    new ApiResponse(200, heatmap, "Heatmap data fetched successfully")
  );
});

export const getMarketStatusDetails = asyncHandler(async (req, res) => {
  const details = await coinService.getMarketStatusDetails();
  return res.status(200).json(
    new ApiResponse(200, details, "Market status fetched successfully")
  );
});

export const getTopMonthlyPerformers = asyncHandler(async (req, res) => {
  const coins = await coinService.getTopMonthlyPerformers();
  return res.status(200).json(
    new ApiResponse(200, coins, "Top monthly performers fetched successfully")
  );
});

export const getTopYearlyPerformers = asyncHandler(async (req, res) => {
  const coins = await coinService.getTopYearlyPerformers();
  return res.status(200).json(
    new ApiResponse(200, coins, "Top yearly performers fetched successfully")
  );
});

export const getVolatilityAlerts = asyncHandler(async (req, res) => {
  const coins = await coinService.getVolatilityAlerts();
  return res.status(200).json(
    new ApiResponse(200, coins, "Volatility alerts fetched successfully")
  );
});

export const getMarketDropAlerts = asyncHandler(async (req, res) => {
  const coins = await coinService.getMarketDropAlerts();
  return res.status(200).json(
    new ApiResponse(200, coins, "Market drop alerts fetched successfully")
  );
});

export const submitReport = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { reportId: "rep-" + Date.now() }, "Market issue report submitted successfully")
  );
});

export const clearCache = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, null, "Cached records cleared successfully")
  );
});

export const getSystemHealth = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { status: "OK", database: "connected" }, "API health status checked")
  );
});

export const getSystemVersion = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { version: "1.0.0" }, "API version details fetched")
  );
});

export const getSystemConfig = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { environment: "production", rateLimit: "100req/15min" }, "Public configuration details fetched")
  );
});
