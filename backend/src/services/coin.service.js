import Coin from "../models/Coin.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationOptions, getPaginationMeta } from "../utils/pagination.js";

const buildCoinQuery = (queryParams) => {
  const query = {};

  if (queryParams.symbol) {
    query.symbol = queryParams.symbol.toUpperCase();
  }

  if (queryParams.minPrice || queryParams.maxPrice) {
    query.price = {};
    if (queryParams.minPrice) {
      query.price.$gte = parseFloat(queryParams.minPrice);
    }
    if (queryParams.maxPrice) {
      query.price.$lte = parseFloat(queryParams.maxPrice);
    }
  }

  if (queryParams.coinId) {
    query.coinId = queryParams.coinId.toLowerCase();
  }

  if (queryParams.month) {
    query.month = { $regex: new RegExp(`^${queryParams.month}$`, "i") };
  }

  if (queryParams.year) {
    query.year = parseInt(queryParams.year, 10);
  }

  if (queryParams.search) {
    query.$or = [
      { name: { $regex: queryParams.search, $options: "i" } },
      { symbol: { $regex: queryParams.search, $options: "i" } },
    ];
  }

  return query;
};

export const getAllCoins = async (queryParams) => {
  const query = buildCoinQuery(queryParams);
  const { page, limit, skip } = getPaginationOptions(queryParams);

  const sortBy = queryParams.sortBy || "rank";
  const sortOrder = queryParams.sortOrder === "desc" ? -1 : 1;
  const sort = { [sortBy]: sortOrder };

  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};

export const getCoinById = async (id) => {
  const coin = await Coin.findById(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return coin;
};

export const createCoin = async (coinData) => {
  const existedCoin = await Coin.findOne({ coinId: coinData.coinId.toLowerCase() });
  if (existedCoin) {
    throw new ApiError(409, "Coin with this coinId already exists");
  }

  const coin = await Coin.create({
    ...coinData,
    coinId: coinData.coinId.toLowerCase(),
  });

  return coin;
};

export const updateCoin = async (id, coinData) => {
  if (coinData.coinId) {
    coinData.coinId = coinData.coinId.toLowerCase();
    const existedCoin = await Coin.findOne({ coinId: coinData.coinId, _id: { $ne: id } });
    if (existedCoin) {
      throw new ApiError(409, "Coin with this coinId already exists");
    }
  }

  const coin = await Coin.findByIdAndUpdate(id, coinData, {
    new: true,
    runValidators: true,
  });

  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }

  return coin;
};

export const deleteCoin = async (id) => {
  const coin = await Coin.findByIdAndDelete(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return coin;
};

export const searchCoins = async (queryParams) => {
  const { q } = queryParams;
  if (!q) {
    throw new ApiError(400, "Search query parameter 'q' is required");
  }

  const query = {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { symbol: { $regex: q, $options: "i" } },
      { coinId: { $regex: q, $options: "i" } },
    ],
  };

  const { page, limit, skip } = getPaginationOptions(queryParams);

  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query)
    .skip(skip)
    .limit(limit);

  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};

export const getTrendingCoins = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;
  const coins = await Coin.find({})
    .sort({ dailyReturn: -1 })
    .limit(limit);

  return coins;
};
