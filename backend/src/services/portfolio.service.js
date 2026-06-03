import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import Coin from "../models/Coin.js";
import Bookmark from "../models/Bookmark.js";
import SearchLog from "../models/SearchLog.js";
import ApiError from "../utils/ApiError.js";

/**
 * Validate MongoDB ID helper
 */
const validateMongoId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }
};

/**
 * Add a coin transaction to user portfolio
 */
export const addPortfolioItem = async (userId, data) => {
  const { coinId, quantity, buyPrice } = data;

  if (!coinId) {
    throw new ApiError(400, "coinId is required");
  }

  if (quantity === undefined || quantity <= 0) {
    throw new ApiError(400, "Quantity must be a positive number greater than zero");
  }

  if (buyPrice === undefined || buyPrice < 0) {
    throw new ApiError(400, "Buy price cannot be negative");
  }

  // Look up Coin to fetch symbol, name, and live price
  let coinObj;
  if (mongoose.Types.ObjectId.isValid(coinId)) {
    coinObj = await Coin.findById(coinId);
  } else {
    coinObj = await Coin.findOne({ coinId: coinId.toLowerCase() });
  }

  if (!coinObj) {
    throw new ApiError(404, "Target coin not found in system database");
  }

  const portfolio = await Portfolio.create({
    user: userId,
    coin: coinObj._id,
    coinName: coinObj.name,
    symbol: coinObj.symbol,
    quantity,
    buyPrice,
    currentPrice: coinObj.price, // Bind current price from live database
  });

  return portfolio;
};

/**
 * Get user's portfolios list with filters, pagination, and totals summary
 */
export const getPortfolios = async (userId, queryParams) => {
  const query = { user: new mongoose.Types.ObjectId(userId) };

  // Filter by profit or loss
  if (queryParams.filter === "profit") {
    query.profitLoss = { $gt: 0 };
  } else if (queryParams.filter === "loss") {
    query.profitLoss = { $lt: 0 };
  }

  // Total summary aggregation calculations
  const totalsResult = await Portfolio.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: "$investedAmount" },
        totalCurrentValue: { $sum: "$currentValue" },
        totalProfitLoss: { $sum: "$profitLoss" },
      },
    },
  ]);

  const totals = totalsResult[0] || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
  };

  // Pagination parameters
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);
  const skip = (page - 1) * limit;

  // Sorting query mapping
  const allowedSorts = ["investedAmount", "currentValue", "profitLoss", "profitLossPercentage", "quantity", "buyPrice", "purchaseDate"];
  const sortBy = allowedSorts.includes(queryParams.sortBy) ? queryParams.sortBy : "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const total = await Portfolio.countDocuments(query);
  const items = await Portfolio.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    totals,
  };
};

/**
 * Fetch detailed view of single portfolio item (User Isolated)
 */
export const getPortfolioItemById = async (userId, id) => {
  validateMongoId(id);

  const item = await Portfolio.findOne({ _id: id, user: userId });
  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  return item;
};

/**
 * Update transaction quantity or purchase buy price (User Isolated)
 */
export const updatePortfolioItem = async (userId, id, data) => {
  validateMongoId(id);
  const { quantity, buyPrice } = data;

  const item = await Portfolio.findOne({ _id: id, user: userId });
  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  if (quantity !== undefined) {
    if (quantity <= 0) {
      throw new ApiError(400, "Quantity must be a positive number greater than zero");
    }
    item.quantity = quantity;
  }

  if (buyPrice !== undefined) {
    if (buyPrice < 0) {
      throw new ApiError(400, "Buy price cannot be negative");
    }
    item.buyPrice = buyPrice;
  }

  // Pre-save calculation hook executes upon save
  await item.save();

  return item;
};

/**
 * Remove transaction item from portfolio (User Isolated)
 */
export const deletePortfolioItem = async (userId, id) => {
  validateMongoId(id);

  const item = await Portfolio.findOneAndDelete({ _id: id, user: userId });
  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  return item;
};

/**
 * Fetch analytics overview summary
 */
export const getAnalyticsSummary = async (userId) => {
  const totalsResult = await Portfolio.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: "$investedAmount" },
        totalCurrentValue: { $sum: "$currentValue" },
        totalProfitLoss: { $sum: "$profitLoss" },
      },
    },
  ]);

  const totals = totalsResult[0] || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
  };

  const bestCoin = await Portfolio.findOne({ user: userId }).sort({ profitLossPercentage: -1 });
  const worstCoin = await Portfolio.findOne({ user: userId }).sort({ profitLossPercentage: 1 });

  return {
    totalInvested: totals.totalInvested,
    totalCurrentValue: totals.totalCurrentValue,
    totalProfitLoss: totals.totalProfitLoss,
    bestPerformingCoin: bestCoin || null,
    worstPerformingCoin: worstCoin || null,
  };
};

/**
 * Fetch portfolio asset percentage distribution using aggregation
 */
export const getAnalyticsDistribution = async (userId) => {
  const totalSummary = await Portfolio.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalValue: { $sum: "$currentValue" },
      },
    },
  ]);

  const totalValue = totalSummary[0]?.totalValue || 0;

  const distribution = await Portfolio.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$symbol",
        coinName: { $first: "$coinName" },
        value: { $sum: "$currentValue" },
        quantity: { $sum: "$quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        symbol: "$_id",
        coinName: 1,
        value: 1,
        quantity: 1,
        percentage: {
          $cond: [
            { $gt: [totalValue, 0] },
            { $multiply: [{ $divide: ["$value", totalValue] }, 100] },
            0,
          ],
        },
      },
    },
    { $sort: { value: -1 } },
  ]);

  return distribution;
};

/**
 * Fetch monthly historical accumulation growth
 */
export const getAnalyticsHistory = async (userId) => {
  const history = await Portfolio.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$purchaseDate" },
          month: { $month: "$purchaseDate" },
        },
        invested: { $sum: "$investedAmount" },
        value: { $sum: "$currentValue" },
        profitLoss: { $sum: "$profitLoss" },
        coinsCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        invested: 1,
        value: 1,
        profitLoss: 1,
        coinsCount: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  return history;
};

/**
 * Fetch advanced dashboard overview including portfolio totals, performance, and chronological recent activity
 */
export const getDashboardOverview = async (userId) => {
  // 1. Calculate Portfolio Totals
  const totalsResult = await Portfolio.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: "$investedAmount" },
        totalCurrentValue: { $sum: "$currentValue" },
        totalProfitLoss: { $sum: "$profitLoss" },
      },
    },
  ]);

  const totals = totalsResult[0] || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
  };

  const totalProfitLossPercentage = totals.totalInvested > 0
    ? (totals.totalProfitLoss / totals.totalInvested) * 100
    : 0;

  // 2. Fetch Performance Extremes
  const bestCoin = await Portfolio.findOne({ user: userId }).sort({ profitLossPercentage: -1 });
  const worstCoin = await Portfolio.findOne({ user: userId }).sort({ profitLossPercentage: 1 });

  // 3. Gather Recent Activities
  const recentTransactions = await Portfolio.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3);

  const recentBookmarks = await Bookmark.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3);

  const recentSearches = await SearchLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3);

  // Map and compile into a chronological feed
  const feed = [];

  recentTransactions.forEach(t => {
    feed.push({
      type: "transaction",
      action: `Purchased ${t.quantity} ${t.symbol}`,
      details: {
        coinName: t.coinName,
        symbol: t.symbol,
        investedAmount: t.investedAmount,
        buyPrice: t.buyPrice,
      },
      timestamp: t.createdAt,
    });
  });

  recentBookmarks.forEach(b => {
    feed.push({
      type: "bookmark",
      action: `Bookmarked ${b.coinName}`,
      details: {
        coinName: b.coinName,
        symbol: b.symbol,
        addedPrice: b.addedPrice,
        category: b.category,
      },
      timestamp: b.createdAt,
    });
  });

  recentSearches.forEach(s => {
    feed.push({
      type: "search",
      action: `Searched for "${s.query}"`,
      details: {
        query: s.query,
      },
      timestamp: s.createdAt,
    });
  });

  // Sort unified feed by timestamp descending
  feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    totals: {
      totalInvested: totals.totalInvested,
      totalCurrentValue: totals.totalCurrentValue,
      totalProfitLoss: totals.totalProfitLoss,
      profitLossPercentage: totalProfitLossPercentage,
    },
    performance: {
      bestPerformingCoin: bestCoin,
      worstPerformingCoin: worstCoin,
    },
    recentActivity: feed.slice(0, 5), // top 5 overall recent activities
  };
};
