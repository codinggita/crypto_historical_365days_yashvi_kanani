import Coin from "../models/Coin.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationOptions, getPaginationMeta } from "../utils/pagination.js";
import mongoose from "mongoose";

/**
 * Helper to validate Mongoose ObjectId format or check slug
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

  // Filtering support
  if (queryParams.category) {
    query.category = { $regex: new RegExp(`^${queryParams.category}$`, "i") };
  }

  if (queryParams.marketStatus) {
    query.marketStatus = { $regex: new RegExp(`^${queryParams.marketStatus}$`, "i") };
  }

  if (queryParams.rank) {
    query.rank = parseInt(queryParams.rank, 10);
  }

  // Volume range filter
  if (queryParams.minVolume || queryParams.maxVolume) {
    query.volume = {};
    if (queryParams.minVolume) {
      query.volume.$gte = parseFloat(queryParams.minVolume);
    }
    if (queryParams.maxVolume) {
      query.volume.$lte = parseFloat(queryParams.maxVolume);
    }
  }

  // MarketCap range filter
  if (queryParams.minMarketCap || queryParams.maxMarketCap) {
    query.marketCap = {};
    if (queryParams.minMarketCap) {
      query.marketCap.$gte = parseFloat(queryParams.minMarketCap);
    }
    if (queryParams.maxMarketCap) {
      query.marketCap.$lte = parseFloat(queryParams.maxMarketCap);
    }
  }

  // Regex Search features on name, symbol, tags
  if (queryParams.q) {
    const searchRegex = { $regex: queryParams.q.trim(), $options: "i" };
    query.$or = [
      { name: searchRegex },
      { symbol: searchRegex },
      { tags: searchRegex }
    ];
  }

  const { page, limit, skip } = getPaginationOptions(queryParams);

  // Sorting
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

  // Update remaining fields
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

  // Perform full replacement
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
 * Get top trending coins (Highest dailyReturn, then highest volume)
 */
export const getTrendingCoins = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;
  const coins = await Coin.find({})
    .sort({ dailyReturn: -1, volume: -1 })
    .limit(limit);
  return coins;
};

/**
 * Get top gainers sorted by dailyReturn descending
 */
export const getTopGainers = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;
  const coins = await Coin.find({})
    .sort({ dailyReturn: -1 })
    .limit(limit);
  return coins;
};

/**
 * Get top losers sorted by dailyReturn ascending
 */
export const getTopLosers = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;
  const coins = await Coin.find({})
    .sort({ dailyReturn: 1 })
    .limit(limit);
  return coins;
};

/**
 * Get platform-wide market summary using MongoDB aggregation pipeline ($match, $group, $sort, $project, $limit, $facet)
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

  const summary = result[0]?.summary || {
    totalMarketCap: 0,
    averagePrice: 0,
    averageVolatility: 0,
    totalVolume: 0,
    totalCoins: 0,
  };

  return summary;
};

/**
 * Global search on name, symbol, tags using regex
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
      { tags: searchRegex }
    ]
  };

  const { page, limit, skip } = getPaginationOptions(queryParams);

  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query)
    .skip(skip)
    .limit(limit);

  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};
