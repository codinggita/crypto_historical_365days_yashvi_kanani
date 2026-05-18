import * as coinService from "../services/coin.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getAllCoins(req.query);

  const response = new ApiResponse(
    200,
    coins,
    "Coins fetched successfully"
  );
  response.pagination = meta;

  return res.status(200).json(response);
});

export const getCoinById = asyncHandler(async (req, res) => {
  const coin = await coinService.getCoinById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      coin,
      "Coin fetched successfully"
    )
  );
});

export const createCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.createCoin(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      coin,
      "Coin created successfully"
    )
  );
});

export const updateCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.updateCoin(req.params.id, req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      coin,
      "Coin updated successfully"
    )
  );
});

export const deleteCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.deleteCoin(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      coin,
      "Coin deleted successfully"
    )
  );
});

export const searchCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.searchCoins(req.query);

  const response = new ApiResponse(
    200,
    coins,
    "Coins search results fetched successfully"
  );
  response.pagination = meta;

  return res.status(200).json(response);
});

export const getTrendingCoins = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const coins = await coinService.getTrendingCoins(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      coins,
      "Trending coins fetched successfully"
    )
  );
});
