import Coin from "../models/Coin.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationOptions, getPaginationMeta } from "../utils/pagination.js";
import mongoose from "mongoose";

/**
 * Helper to find a coin by MongoDB ObjectId or coinId slug
 */
const findCoinByFlexibleId = async (id) => {
  let coin;
  if (mongoose.Types.ObjectId.isValid(id)) {
    coin = await Coin.findById(id);
  } else {
    coin = await Coin.findOne({ coinId: id.toLowerCase() });
  }
  return coin;
};

/**
 * Fetch all coins with pagination, filtering, sorting, and regex searching
 */
export const getAllCoins = async (queryParams) => {
  const query = {};

  // Category filter (case-insensitive exact match)
  if (queryParams.category) {
    query.category = { $regex: new RegExp(`^${queryParams.category}$`, "i") };
  }

  // Market status filter
  if (queryParams.marketStatus) {
    query.marketStatus = { $regex: new RegExp(`^${queryParams.marketStatus}$`, "i") };
  }

  // Symbol exact match
  if (queryParams.symbol) {
    query.symbol = queryParams.symbol.toUpperCase();
  }

  // Exact rank filter
  if (queryParams.rank) {
    query.rank = parseInt(queryParams.rank, 10);
  }

  // Price range filter
  if (queryParams.minPrice || queryParams.maxPrice) {
    query.price = {};
    if (queryParams.minPrice) query.price.$gte = parseFloat(queryParams.minPrice);
    if (queryParams.maxPrice) query.price.$lte = parseFloat(queryParams.maxPrice);
  }

  // Volume range filter
  if (queryParams.minVolume || queryParams.maxVolume) {
    query.volume = {};
    if (queryParams.minVolume) query.volume.$gte = parseFloat(queryParams.minVolume);
    if (queryParams.maxVolume) query.volume.$lte = parseFloat(queryParams.maxVolume);
  }

  // MarketCap range filter
  if (queryParams.minMarketCap || queryParams.maxMarketCap) {
    query.marketCap = {};
    if (queryParams.minMarketCap) query.marketCap.$gte = parseFloat(queryParams.minMarketCap);
    if (queryParams.maxMarketCap) query.marketCap.$lte = parseFloat(queryParams.maxMarketCap);
  }

  // Regex search on name, symbol, coinId, and tags (supports ?q=)
  const searchVal = queryParams.q || queryParams.search;
  if (searchVal && searchVal.trim() !== "") {
    const searchRegex = { $regex: searchVal.trim(), $options: "i" };
    query.$or = [
      { name: searchRegex },
      { symbol: searchRegex },
      { coinId: searchRegex },
      { tags: searchRegex },
    ];
  }

  // Sanitize and derive pagination
  const sanitizedQuery = { ...queryParams };
  sanitizedQuery.page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  sanitizedQuery.limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);

  const { page, limit, skip } = getPaginationOptions(sanitizedQuery);

  // Validated sorting
  const allowedSortFields = ["price", "marketCap", "volume", "rank", "dailyReturn", "volatility", "createdAt"];
  const sortBy = allowedSortFields.includes(queryParams.sortBy) ? queryParams.sortBy : "rank";
  const sortOrder = queryParams.sortOrder === "desc" ? -1 : 1;
  const sort = { [sortBy]: sortOrder };

  // Optional field projection (comma-separated, e.g. ?fields=name,symbol,price)
  let projection = "";
  if (queryParams.fields) {
    projection = queryParams.fields.split(",").join(" ");
  }

  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query)
    .select(projection)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};

/**
 * Fetch a single coin by ID (ObjectId or coinId slug)
 */
export const getCoinById = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return coin;
};

/**
 * Create a new coin with duplicate coinId & symbol validation
 */
export const createCoin = async (coinData) => {
  const lowercaseCoinId = coinData.coinId.toLowerCase();
  const uppercaseSymbol = coinData.symbol.toUpperCase();

  const existingCoinId = await Coin.findOne({ coinId: lowercaseCoinId });
  if (existingCoinId) {
    throw new ApiError(409, "Coin with this coinId already exists");
  }

  const existingSymbol = await Coin.findOne({ symbol: uppercaseSymbol });
  if (existingSymbol) {
    throw new ApiError(409, "Coin with this symbol already exists");
  }

  const coin = await Coin.create({
    ...coinData,
    coinId: lowercaseCoinId,
    symbol: uppercaseSymbol,
  });

  return coin;
};

/**
 * Partial update a coin (PATCH)
 */
export const updateCoin = async (id, coinData) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }

  if (coinData.coinId) {
    const lowercaseCoinId = coinData.coinId.toLowerCase();
    const existing = await Coin.findOne({ coinId: lowercaseCoinId, _id: { $ne: coin._id } });
    if (existing) {
      throw new ApiError(409, "Coin with this coinId already exists");
    }
    coin.coinId = lowercaseCoinId;
  }

  if (coinData.symbol) {
    const uppercaseSymbol = coinData.symbol.toUpperCase();
    const existing = await Coin.findOne({ symbol: uppercaseSymbol, _id: { $ne: coin._id } });
    if (existing) {
      throw new ApiError(409, "Coin with this symbol already exists");
    }
    coin.symbol = uppercaseSymbol;
  }

  // Update all remaining fields
  Object.keys(coinData).forEach((key) => {
    if (key !== "coinId" && key !== "symbol") {
      coin[key] = coinData[key];
    }
  });

  await coin.save();
  return coin;
};

/**
 * Replace full coin data (PUT)
 */
export const replaceCoin = async (id, coinData) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }

  const lowercaseCoinId = coinData.coinId.toLowerCase();
  const uppercaseSymbol = coinData.symbol.toUpperCase();

  const existingCoinId = await Coin.findOne({ coinId: lowercaseCoinId, _id: { $ne: coin._id } });
  if (existingCoinId) {
    throw new ApiError(409, "Coin with this coinId already exists");
  }

  const existingSymbol = await Coin.findOne({ symbol: uppercaseSymbol, _id: { $ne: coin._id } });
  if (existingSymbol) {
    throw new ApiError(409, "Coin with this symbol already exists");
  }

  // Full replacement
  coin.coinId = lowercaseCoinId;
  coin.name = coinData.name;
  coin.symbol = uppercaseSymbol;
  coin.price = coinData.price;
  coin.rank = coinData.rank ?? 1;
  coin.marketCap = coinData.marketCap ?? 0;
  coin.volume = coinData.volume ?? 0;
  coin.dailyReturn = coinData.dailyReturn ?? 0;
  coin.volatility = coinData.volatility ?? 0;
  coin.circulatingSupply = coinData.circulatingSupply ?? 0;
  coin.totalSupply = coinData.totalSupply ?? 0;
  coin.maxSupply = coinData.maxSupply ?? 0;
  coin.category = coinData.category ?? "";
  coin.image = coinData.image ?? "";
  coin.marketStatus = coinData.marketStatus ?? "active";
  coin.tags = coinData.tags ?? [];
  coin.timestamp = coinData.timestamp ?? Date.now();

  await coin.save();
  return coin;
};

/**
 * Delete a coin
 */
export const deleteCoin = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  await Coin.findByIdAndDelete(coin._id);
  return coin;
};

/**
 * Get top trending coins (highest dailyReturn + volume)
 */
export const getTrendingCoins = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;
  return await Coin.find({})
    .sort({ dailyReturn: -1, volume: -1 })
    .limit(limit);
};

/**
 * Get top gainers sorted by dailyReturn descending
 */
export const getTopGainers = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;
  return await Coin.find({})
    .sort({ dailyReturn: -1 })
    .limit(limit);
};

/**
 * Get top losers sorted by dailyReturn ascending
 */
export const getTopLosers = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;
  return await Coin.find({})
    .sort({ dailyReturn: 1 })
    .limit(limit);
};

/**
 * Get most recently added coins sorted by createdAt descending
 */
export const getRecentCoins = async (limitParam = 10) => {
  const limit = parseInt(limitParam, 10) || 10;
  return await Coin.find({})
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get a single random coin using MongoDB $sample aggregation
 */
export const getRandomCoin = async () => {
  const result = await Coin.aggregate([{ $sample: { size: 1 } }]);
  return result[0] || null;
};

/**
 * Get platform-wide market summary using MongoDB aggregation ($facet, $group, $project)
 */
export const getMarketSummary = async () => {
  const result = await Coin.aggregate([
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalMarketCap: { $sum: "$marketCap" },
              averagePrice: { $avg: "$price" },
              averageVolatility: { $avg: "$volatility" },
              totalVolume: { $sum: "$volume" },
              totalCoins: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $project: {
        summary: { $arrayElemAt: ["$summary", 0] },
      },
    },
  ]);

  return result[0]?.summary || {
    totalMarketCap: 0,
    averagePrice: 0,
    averageVolatility: 0,
    totalVolume: 0,
    totalCoins: 0,
  };
};

/**
 * Global search on name, symbol, coinId, tags using regex with pagination
 */
export const getGlobalSearch = async (queryParams) => {
  const { q } = queryParams;
  if (!q) {
    throw new ApiError(400, "Search query parameter 'q' is required");
  }

  const searchRegex = { $regex: q.trim(), $options: "i" };
  const query = {
    $or: [
      { name: searchRegex },
      { symbol: searchRegex },
      { coinId: searchRegex },
      { tags: searchRegex },
    ],
  };

  const sanitizedQuery = { ...queryParams };
  sanitizedQuery.page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  sanitizedQuery.limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);

  const { page, limit, skip } = getPaginationOptions(sanitizedQuery);

  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query).skip(skip).limit(limit);
  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};
