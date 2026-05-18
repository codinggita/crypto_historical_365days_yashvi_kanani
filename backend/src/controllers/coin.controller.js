import * as coinService from "../services/coin.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getAllCoins(req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Coins fetched successfully", meta)
  );
});

export const getCoinById = asyncHandler(async (req, res) => {
  const coin = await coinService.getCoinById(req.params.id);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin fetched successfully")
  );
});

export const createCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.createCoin(req.body);
  return res.status(201).json(
    new ApiResponse(201, coin, "Coin created successfully")
  );
});

export const updateCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.updateCoin(req.params.id, req.body);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin updated successfully")
  );
});

export const deleteCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.deleteCoin(req.params.id);
  return res.status(200).json(
    new ApiResponse(200, coin, "Coin deleted successfully")
  );
});

export const searchCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.searchCoins(req.query);
  return res.status(200).json(
    new ApiResponse(200, coins, "Coins search results fetched successfully", meta)
  );
});

export const getTrendingCoins = asyncHandler(async (req, res) => {
  const coins = await coinService.getTrendingCoins();
  return res.status(200).json(
    new ApiResponse(200, coins, "Trending coins fetched successfully")
  );
});

export const getTopGainers = asyncHandler(async (req, res) => {
  const coins = await coinService.getTopGainers();
  return res.status(200).json(
    new ApiResponse(200, coins, "Top gainers fetched successfully")
  );
});

export const getTopLosers = asyncHandler(async (req, res) => {
  const coins = await coinService.getTopLosers();
  return res.status(200).json(
    new ApiResponse(200, coins, "Top losers fetched successfully")
  );
});

export const getRecentCoins = asyncHandler(async (req, res) => {
  const coins = await coinService.getRecentCoins();
  return res.status(200).json(
    new ApiResponse(200, coins, "Recent coins fetched successfully")
  );
});

export const getRandomCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.getRandomCoin();
  return res.status(200).json(
    new ApiResponse(200, coin, "Random coin fetched successfully")
  );
});

export const getSuggestions = asyncHandler(async (req, res) => {
  const q = req.query.q || req.query.search;
  const suggestions = await coinService.getSuggestions(q);
  return res.status(200).json(
    new ApiResponse(200, suggestions, "Suggestions fetched successfully")
  );
});
