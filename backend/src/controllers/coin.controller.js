const coinService = require("../services/coin.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getAllCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.getAllCoins(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      coins,
      "Coins fetched successfully",
      meta
    )
  );
});

const getCoinById = asyncHandler(async (req, res) => {
  const coin = await coinService.getCoinById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      coin,
      "Coin fetched successfully"
    )
  );
});

const createCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.createCoin(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      coin,
      "Coin created successfully"
    )
  );
});

const updateCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.updateCoin(req.params.id, req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      coin,
      "Coin updated successfully"
    )
  );
});

const deleteCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.deleteCoin(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      coin,
      "Coin deleted successfully"
    )
  );
});

const searchCoins = asyncHandler(async (req, res) => {
  const { coins, meta } = await coinService.searchCoins(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      coins,
      "Coins search results fetched successfully",
      meta
    )
  );
});

const getTrendingCoins = asyncHandler(async (req, res) => {
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

module.exports = {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin,
  searchCoins,
  getTrendingCoins,
};
