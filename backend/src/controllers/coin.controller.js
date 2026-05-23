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
 * GET /coins/trending - Retrieve top trending coins
 */
export const getTrendingCoins = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const coins = await coinService.getTrendingCoins(limit);
  return res.status(200).json(
    new ApiResponse(200, coins, "Trending coins fetched successfully")
  );
});

/**
 * GET /coins/top-gainers - Retrieve top gainers by dailyReturn
 */
export const getTopGainers = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const coins = await coinService.getTopGainers(limit);
  return res.status(200).json(
    new ApiResponse(200, coins, "Top gainers fetched successfully")
  );
});

/**
 * GET /coins/top-losers - Retrieve top losers by dailyReturn
 */
export const getTopLosers = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const coins = await coinService.getTopLosers(limit);
  return res.status(200).json(
    new ApiResponse(200, coins, "Top losers fetched successfully")
  );
});

/**
 * GET /coins/market/summary - Retrieve platform-wide market statistics
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
