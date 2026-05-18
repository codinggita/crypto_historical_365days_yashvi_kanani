import Coin from "../models/Coin.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationOptions, getPaginationMeta } from "../utils/pagination.js";

const buildCoinQuery = (queryParams) => {
  const query = {};

  // Global search via q or search (case-insensitive regex)
  const searchVal = queryParams.q || queryParams.search;
  if (searchVal && searchVal.trim() !== "") {
    query.$or = [
      { name: { $regex: searchVal, $options: "i" } },
      { symbol: { $regex: searchVal, $options: "i" } },
      { coinId: { $regex: searchVal, $options: "i" } },
    ];
  }

  if (queryParams.symbol) {
    query.symbol = queryParams.symbol.toUpperCase();
  }

  if (queryParams.coinId) {
    query.coinId = queryParams.coinId.toLowerCase();
  }

  // Price Range
  if (queryParams.minPrice || queryParams.maxPrice) {
    query.price = {};
    if (queryParams.minPrice) query.price.$gte = parseFloat(queryParams.minPrice);
    if (queryParams.maxPrice) query.price.$lte = parseFloat(queryParams.maxPrice);
  }

  // MarketCap Range
  if (queryParams.minMarketCap || queryParams.maxMarketCap) {
    query.marketCap = {};
    if (queryParams.minMarketCap) query.marketCap.$gte = parseFloat(queryParams.minMarketCap);
    if (queryParams.maxMarketCap) query.marketCap.$lte = parseFloat(queryParams.maxMarketCap);
  }

  // Volume Range
  if (queryParams.minVolume || queryParams.maxVolume) {
    query.volume = {};
    if (queryParams.minVolume) query.volume.$gte = parseFloat(queryParams.minVolume);
    if (queryParams.maxVolume) query.volume.$lte = parseFloat(queryParams.maxVolume);
  }

  // Exact Month
  if (queryParams.month) {
    query.month = { $regex: new RegExp(`^${queryParams.month}$`, "i") };
  }

  // Exact Year
  if (queryParams.year) {
    query.year = parseInt(queryParams.year, 10);
  }

  // Exact Rank
  if (queryParams.rank) {
    query.rank = parseInt(queryParams.rank, 10);
  }

  // Exact Volatility
  if (queryParams.volatility) {
    query.volatility = parseFloat(queryParams.volatility);
  }

  return query;
};

export const getAllCoins = async (queryParams) => {
  const query = buildCoinQuery(queryParams);

  // Sanitize pagination to prevent negative or zero parameters
  const sanitizedQuery = { ...queryParams };
  sanitizedQuery.page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  sanitizedQuery.limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);

  const { page, limit, skip } = getPaginationOptions(sanitizedQuery);

  // Sortable fields validation
  const allowedSortFields = ["price", "marketCap", "volume", "rank", "dailyReturn", "volatility", "createdAt"];
  const sortBy = allowedSortFields.includes(queryParams.sortBy) ? queryParams.sortBy : "rank";
  const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  // Field selection projection
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
  const q = queryParams.q || queryParams.search;
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

  const sanitizedQuery = { ...queryParams };
  sanitizedQuery.page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  sanitizedQuery.limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);

  const { page, limit, skip } = getPaginationOptions(sanitizedQuery);

  const totalItems = await Coin.countDocuments(query);
  const coins = await Coin.find(query)
    .skip(skip)
    .limit(limit);

  const meta = getPaginationMeta(totalItems, page, limit);

  return { coins, meta };
};

export const getTrendingCoins = async () => {
  return await Coin.find({})
    .sort({ marketCap: -1 })
    .limit(10);
};

export const getTopGainers = async () => {
  return await Coin.find({})
    .sort({ dailyReturn: -1 })
    .limit(10);
};

export const getTopLosers = async () => {
  return await Coin.find({})
    .sort({ dailyReturn: 1 })
    .limit(10);
};

export const getRecentCoins = async () => {
  return await Coin.find({})
    .sort({ createdAt: -1 })
    .limit(10);
};

export const getRandomCoin = async () => {
  const result = await Coin.aggregate([{ $sample: { size: 1 } }]);
  return result[0] || null;
};

export const getSuggestions = async (q) => {
  if (!q || q.trim() === "") return [];
  return await Coin.find(
    {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { symbol: { $regex: q, $options: "i" } },
        { coinId: { $regex: q, $options: "i" } },
      ],
    },
    { name: 1, symbol: 1, coinId: 1, _id: 0 }
  ).limit(5);
};
