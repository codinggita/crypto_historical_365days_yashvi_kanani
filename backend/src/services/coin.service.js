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

/**
 * Check if a coin exists by ID
 */
export const checkCoinExists = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  return !!coin;
};

/**
 * Bulk create coins
 */
export const bulkCreateCoins = async (coinsArray) => {
  if (!Array.isArray(coinsArray)) {
    throw new ApiError(400, "Payload must be an array of coins");
  }
  const sanitized = coinsArray.map((coin) => ({
    ...coin,
    coinId: coin.coinId.toLowerCase(),
    symbol: coin.symbol.toUpperCase(),
  }));
  return await Coin.insertMany(sanitized);
};

/**
 * Bulk update coins
 */
export const bulkUpdateCoins = async (coinsArray) => {
  if (!Array.isArray(coinsArray)) {
    throw new ApiError(400, "Payload must be an array of coins to update");
  }
  const operations = coinsArray.map((coin) => {
    const { id, coinId, ...updateFields } = coin;
    const filter = {};
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      filter._id = id;
    } else if (coinId) {
      filter.coinId = coinId.toLowerCase();
    } else {
      throw new ApiError(400, "Each coin to update must specify an id or coinId");
    }
    if (updateFields.symbol) {
      updateFields.symbol = updateFields.symbol.toUpperCase();
    }
    return {
      updateOne: {
        filter,
        update: { $set: updateFields },
      },
    };
  });
  return await Coin.bulkWrite(operations);
};

/**
 * Bulk delete coins
 */
export const bulkDeleteCoins = async (idsArray) => {
  if (!Array.isArray(idsArray)) {
    throw new ApiError(400, "Payload must be an array of coinIds or objectIds");
  }
  const objectIds = idsArray.filter((id) => mongoose.Types.ObjectId.isValid(id));
  const stringIds = idsArray.filter((id) => !mongoose.Types.ObjectId.isValid(id)).map(id => id.toLowerCase());

  return await Coin.deleteMany({
    $or: [
      { _id: { $in: objectIds } },
      { coinId: { $in: stringIds } },
    ],
  });
};

/**
 * Fetch coin details using coin name (case-insensitive)
 */
export const getCoinByName = async (coinName) => {
  const coin = await Coin.findOne({ name: { $regex: new RegExp(`^${coinName}$`, "i") } });
  if (!coin) {
    throw new ApiError(404, `Coin with name '${coinName}' not found`);
  }
  return coin;
};

/**
 * Fetch coin details using trading symbol
 */
export const getCoinBySymbol = async (symbol) => {
  const coin = await Coin.findOne({ symbol: symbol.toUpperCase() });
  if (!coin) {
    throw new ApiError(404, `Coin with symbol '${symbol}' not found`);
  }
  return coin;
};

/**
 * Fetch coins by market cap rank
 */
export const getCoinsByRank = async (rank) => {
  const coins = await Coin.find({ rank: parseInt(rank, 10) });
  return coins;
};

/**
 * Fetch coins for a specific month (supports YYYY-MM or Month Name)
 */
export const getCoinsByMonth = async (monthStr, queryParams = {}) => {
  const query = {};
  if (/^\d{4}-\d{2}$/.test(monthStr)) {
    const [year, month] = monthStr.split("-");
    const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    query.timestamp = { $gte: start, $lt: end };
  } else {
    query.month = monthStr;
  }

  const { page, limit, skip } = getPaginationOptions(queryParams);
  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query).skip(skip).limit(limit);
  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};

/**
 * Fetch records for a specific date (YYYY-MM-DD)
 */
export const getCoinsByDate = async (dateStr) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new ApiError(400, "Invalid date format. Expected YYYY-MM-DD");
  }
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  if (isNaN(start.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return await Coin.find({
    timestamp: { $gte: start, $lt: end },
  });
};

/**
 * Fetch latest market records
 */
export const getLatestCoins = async (queryParams = {}) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  const totalItems = await Coin.countDocuments({});
  const coins = await Coin.find({}).sort({ timestamp: -1, createdAt: -1 }).skip(skip).limit(limit);
  const meta = getPaginationMeta(totalItems, page, limit);
  return { coins, meta };
};

/**
 * Fetch complete historical data of a coin
 */
export const getCoinHistory = async (id, queryParams = {}) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  const { page, limit, skip } = getPaginationOptions(queryParams);
  const query = { coinId: coin.coinId };
  const totalItems = await Coin.countDocuments(query);
  const history = await Coin.find(query).sort({ timestamp: 1 }).skip(skip).limit(limit);
  const meta = getPaginationMeta(totalItems, page, limit);
  return { history, meta };
};

/**
 * Fetch historical monthly records of a coin
 */
export const getCoinHistoryByMonth = async (id, monthStr) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  const query = { coinId: coin.coinId };
  if (/^\d{4}-\d{2}$/.test(monthStr)) {
    const [year, month] = monthStr.split("-");
    const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    query.timestamp = { $gte: start, $lt: end };
  } else {
    query.month = monthStr;
  }
  return await Coin.find(query).sort({ timestamp: 1 });
};

/**
 * Fetch highest market cap coins
 */
export const getTopMarketCapCoins = async (queryParams = {}) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  const totalItems = await Coin.countDocuments({});
  const coins = await Coin.find({}).sort({ marketCap: -1 }).skip(skip).limit(limit);
  const meta = getPaginationMeta(totalItems, page, limit);
  return { coins, meta };
};

/**
 * Fetch top traded volume coins
 */
export const getTopVolumeCoins = async (queryParams = {}) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  const totalItems = await Coin.countDocuments({});
  const coins = await Coin.find({}).sort({ volume: -1 }).skip(skip).limit(limit);
  const meta = getPaginationMeta(totalItems, page, limit);
  return { coins, meta };
};

/**
 * Fetch oldest available records
 */
export const getOldestCoins = async () => {
  return await Coin.find({}).sort({ timestamp: 1, createdAt: 1 }).limit(10);
};

/**
 * Fetch newest available records
 */
export const getNewestCoins = async () => {
  return await Coin.find({}).sort({ timestamp: -1, createdAt: -1 }).limit(10);
};

/**
 * Fetch performance analytics of a coin
 */
export const getCoinPerformance = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return {
    coinId: coin.coinId,
    name: coin.name,
    dailyReturn: coin.dailyReturn,
    performanceTier: coin.dailyReturn > 2 ? "High Performing" : coin.dailyReturn > 0 ? "Moderate" : "Underperforming",
    updatedAt: coin.updatedAt,
  };
};

/**
 * Fetch volatility analytics
 */
export const getCoinVolatility = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return {
    coinId: coin.coinId,
    name: coin.name,
    volatility: coin.volatility,
    riskRating: coin.volatility > 3 ? "High Risk" : coin.volatility > 1.5 ? "Medium Risk" : "Low Risk",
  };
};

/**
 * Fetch market capitalization details
 */
export const getCoinMarketCapDetails = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return {
    coinId: coin.coinId,
    name: coin.name,
    marketCap: coin.marketCap,
    circulatingSupply: coin.circulatingSupply,
    totalSupply: coin.totalSupply,
  };
};

/**
 * Fetch trading volume details
 */
export const getCoinVolumeDetails = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return {
    coinId: coin.coinId,
    name: coin.name,
    volume: coin.volume,
    liquidityScore: Math.round(coin.volume / (coin.marketCap || 1) * 10000) / 100,
  };
};

/**
 * Fetch returns analytics
 */
export const getCoinReturns = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return {
    coinId: coin.coinId,
    name: coin.name,
    dailyReturn: coin.dailyReturn,
    cumulativeReturn: Math.round((coin.dailyReturn * 30) * 100) / 100,
  };
};

/**
 * Compare two or three cryptocurrencies
 */
export const compareCoins = async (coinIds) => {
  const list = [];
  for (const id of coinIds) {
    const coin = await findCoinByFlexibleId(id);
    if (coin) {
      list.push(coin);
    }
  }
  return list;
};

/**
 * Fetch current price of coin
 */
export const getCoinPriceOnly = async (id) => {
  const coin = await findCoinByFlexibleId(id);
  if (!coin) {
    throw new ApiError(404, "Coin not found");
  }
  return {
    coinId: coin.coinId,
    symbol: coin.symbol,
    price: coin.price,
    timestamp: coin.timestamp,
  };
};

/**
 * Filter coins by custom criteria
 */
export const filterCoinsByCriteria = async (criteria) => {
  const query = {};
  switch (criteria) {
    case "high-price":
      query.price = { $gte: 1000 };
      break;
    case "low-price":
      query.price = { $lte: 1 };
      break;
    case "high-volume":
      query.volume = { $gte: 1000000000 };
      break;
    case "low-volume":
      query.volume = { $lte: 1000000 };
      break;
    case "high-market-cap":
      query.marketCap = { $gte: 10000000000 };
      break;
    case "low-market-cap":
      query.marketCap = { $lte: 100000000 };
      break;
    case "high-volatility":
      query.volatility = { $gte: 3.0 };
      break;
    case "low-volatility":
      query.volatility = { $lte: 1.5 };
      break;
    case "high-return":
      query.dailyReturn = { $gte: 2.0 };
      break;
    case "negative-return":
      query.dailyReturn = { $lt: 0 };
      break;
    case "bullish":
      query.dailyReturn = { $gte: 1.5 };
      break;
    case "bearish":
      query.dailyReturn = { $lte: -1.5 };
      break;
    case "profitable":
      query.dailyReturn = { $gt: 0 };
      break;
    case "loss-making":
      query.dailyReturn = { $lt: 0 };
      break;
    case "missing-values":
      query.$or = [
        { price: { $exists: false } },
        { marketCap: { $exists: false } },
        { volume: { $exists: false } },
      ];
      break;
    default:
      break;
  }
  return await Coin.find(query).sort({ rank: 1 });
};

/**
 * Advanced recommendations
 */
export const getRecommendations = async () => {
  return await Coin.find({ dailyReturn: { $gt: 0 }, volatility: { $lt: 3.5 } }).sort({ dailyReturn: -1 }).limit(5);
};

/**
 * Advanced predictions
 */
export const getPredictions = async () => {
  const coins = await Coin.find({}).limit(10);
  return coins.map((coin) => ({
    coinId: coin.coinId,
    name: coin.name,
    currentPrice: coin.price,
    predictedPrice24h: Math.round(coin.price * (1 + (coin.dailyReturn / 100)) * 100) / 100,
    confidence: Math.round((100 - coin.volatility * 10) * 100) / 100,
  }));
};

/**
 * Heatmap data
 */
export const getHeatmapData = async () => {
  const coins = await Coin.find({});
  return coins.map((coin) => ({
    coinId: coin.coinId,
    symbol: coin.symbol,
    price: coin.price,
    dailyReturn: coin.dailyReturn,
    marketCap: coin.marketCap,
  }));
};

/**
 * Market status
 */
export const getMarketStatusDetails = async () => {
  const coins = await Coin.find({});
  const totalMarketCap = coins.reduce((acc, c) => acc + (c.marketCap || 0), 0);
  const totalVolume = coins.reduce((acc, c) => acc + (c.volume || 0), 0);
  const activeCoins = coins.filter(c => c.marketStatus === "active").length;

  return {
    totalCoins: coins.length,
    activeCoins,
    totalMarketCap,
    totalVolume,
    marketCondition: activeCoins > coins.length / 2 ? "Bullish" : "Bearish",
  };
};

/**
 * Top monthly performers
 */
export const getTopMonthlyPerformers = async () => {
  return await Coin.find({ dailyReturn: { $gt: 0 } }).sort({ dailyReturn: -1 }).limit(5);
};

/**
 * Top yearly performers
 */
export const getTopYearlyPerformers = async () => {
  return await Coin.find({ dailyReturn: { $gt: 0 } }).sort({ dailyReturn: -1 }).limit(5);
};

/**
 * Volatility alerts
 */
export const getVolatilityAlerts = async () => {
  return await Coin.find({ volatility: { $gte: 4.0 } }).sort({ volatility: -1 });
};

/**
 * Market drop alerts
 */
export const getMarketDropAlerts = async () => {
  return await Coin.find({ dailyReturn: { $lte: -5.0 } }).sort({ dailyReturn: 1 });
};

