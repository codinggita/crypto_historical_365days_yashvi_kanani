import mongoose from "mongoose";
import Bookmark from "../models/Bookmark.js";
import Coin from "../models/Coin.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationOptions, getPaginationMeta } from "../utils/pagination.js";

/**
 * Validate MongoDB ID helper
 */
const validateMongoId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }
};

/**
 * Add coin to user watchlist/bookmarks
 */
export const addBookmark = async (userId, coinId, data) => {
  const { category, notes } = data;

  if (!coinId) {
    throw new ApiError(400, "coinId is required");
  }

  // Look up Coin by ObjectId or coinId slug
  let coinObj;
  if (mongoose.Types.ObjectId.isValid(coinId)) {
    coinObj = await Coin.findById(coinId);
  } else {
    coinObj = await Coin.findOne({ coinId: coinId.toLowerCase() });
  }

  if (!coinObj) {
    throw new ApiError(404, "Target coin not found in system database");
  }

  // Prevent duplicates
  const existedBookmark = await Bookmark.findOne({
    user: userId,
    coin: coinObj._id,
  });

  if (existedBookmark) {
    throw new ApiError(400, "Coin is already bookmarked/in watchlist");
  }

  const bookmark = await Bookmark.create({
    user: userId,
    coin: coinObj._id,
    coinName: coinObj.name,
    symbol: coinObj.symbol,
    addedPrice: coinObj.price,
    currentPrice: coinObj.price, // Initialize current price to live price
    category: category || "watchlist",
    notes: notes || "",
  });

  return bookmark;
};

/**
 * Get logged-in user bookmarks with pagination, sorting, filtering, and search
 */
export const getBookmarks = async (userId, queryParams) => {
  const query = { user: new mongoose.Types.ObjectId(userId) };

  // Filtering by category
  if (queryParams.category) {
    query.category = queryParams.category;
  }

  // Regex Search by coin name or symbol
  if (queryParams.q) {
    query.$or = [
      { coinName: { $regex: queryParams.q, $options: "i" } },
      { symbol: { $regex: queryParams.q, $options: "i" } },
    ];
  }

  // Pagination parameters
  const { page, limit, skip } = getPaginationOptions(queryParams);

  // Sorting
  const sortBy = queryParams.sortBy || "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const total = await Bookmark.countDocuments(query);
  const items = await Bookmark.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Optionally, update currentPrice with the live coin price dynamically
  const updatedItems = await Promise.all(
    items.map(async (item) => {
      const coin = await Coin.findById(item.coin);
      if (coin && coin.price !== item.currentPrice) {
        item.currentPrice = coin.price;
        await item.save();
      }
      return item;
    })
  );

  const meta = getPaginationMeta(total, page, limit);

  return {
    items: updatedItems,
    meta,
  };
};

/**
 * Get single bookmarked coin (User Isolated)
 */
export const getBookmarkById = async (userId, id) => {
  validateMongoId(id);

  const bookmark = await Bookmark.findOne({ _id: id, user: userId });
  if (!bookmark) {
    throw new ApiError(404, "Bookmark not found");
  }

  // Sync currentPrice with live price
  const coin = await Coin.findById(bookmark.coin);
  if (coin && coin.price !== bookmark.currentPrice) {
    bookmark.currentPrice = coin.price;
    await bookmark.save();
  }

  return bookmark;
};

/**
 * Update bookmark notes / category (User Isolated)
 */
export const updateBookmark = async (userId, id, data) => {
  validateMongoId(id);
  const { category, notes } = data;

  const bookmark = await Bookmark.findOne({ _id: id, user: userId });
  if (!bookmark) {
    throw new ApiError(404, "Bookmark not found");
  }

  if (category !== undefined) {
    bookmark.category = category;
  }

  if (notes !== undefined) {
    bookmark.notes = notes;
  }

  await bookmark.save();
  return bookmark;
};

/**
 * Remove bookmark/watchlist item (User Isolated)
 */
export const deleteBookmark = async (userId, id) => {
  validateMongoId(id);

  const bookmark = await Bookmark.findOneAndDelete({ _id: id, user: userId });
  if (!bookmark) {
    throw new ApiError(404, "Bookmark not found");
  }

  return bookmark;
};

/**
 * Check if coin already bookmarked
 */
export const checkBookmarkStatus = async (userId, coinId) => {
  let coinObj;
  if (mongoose.Types.ObjectId.isValid(coinId)) {
    coinObj = await Coin.findById(coinId);
  } else {
    coinObj = await Coin.findOne({ coinId: coinId.toLowerCase() });
  }

  if (!coinObj) {
    return { bookmarked: false };
  }

  const bookmark = await Bookmark.findOne({ user: userId, coin: coinObj._id });
  return { bookmarked: !!bookmark };
};

/**
 * Get bookmark analytics summary for user
 */
export const getAnalyticsSummary = async (userId) => {
  const totalBookmarked = await Bookmark.countDocuments({ user: userId });

  // Highest market cap bookmarked coin (using lookup for live marketCap)
  const highestMarketCapResult = await Bookmark.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "coins",
        localField: "coin",
        foreignField: "_id",
        as: "coinDetails",
      },
    },
    { $unwind: "$coinDetails" },
    { $sort: { "coinDetails.marketCap": -1 } },
    { $limit: 1 },
  ]);

  const highestMarketCap = highestMarketCapResult[0]
    ? {
        bookmarkId: highestMarketCapResult[0]._id,
        coinId: highestMarketCapResult[0].coin,
        coinName: highestMarketCapResult[0].coinName,
        symbol: highestMarketCapResult[0].symbol,
        marketCap: highestMarketCapResult[0].coinDetails.marketCap,
      }
    : null;

  // Highest profit potential coin: live coin price vs addedPrice
  const highestProfitPotentialResult = await Bookmark.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "coins",
        localField: "coin",
        foreignField: "_id",
        as: "coinDetails",
      },
    },
    { $unwind: "$coinDetails" },
    {
      $project: {
        coinId: "$coin",
        coinName: "$coinName",
        symbol: "$symbol",
        addedPrice: 1,
        livePrice: "$coinDetails.price",
        profitPotential: {
          $cond: [
            { $gt: ["$addedPrice", 0] },
            {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$coinDetails.price", "$addedPrice"] },
                    "$addedPrice",
                  ],
                },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
    { $sort: { profitPotential: -1 } },
    { $limit: 1 },
  ]);

  const highestProfitPotential = highestProfitPotentialResult[0] || null;

  // Recently added bookmarks (limited to 5)
  const recentlyAdded = await Bookmark.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    totalBookmarked,
    highestMarketCap,
    highestProfitPotential,
    recentlyAdded,
  };
};

/**
 * Get trending bookmarks globally using aggregate
 */
export const getTrendingBookmarks = async (limitParam = 5) => {
  const limit = parseInt(limitParam, 10) || 5;

  const trending = await Bookmark.aggregate([
    {
      $group: {
        _id: "$coin",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "coins",
        localField: "_id",
        foreignField: "_id",
        as: "coinDetails",
      },
    },
    { $unwind: "$coinDetails" },
    {
      $project: {
        _id: 0,
        coinId: "$_id",
        count: 1,
        coinName: "$coinDetails.name",
        symbol: "$coinDetails.symbol",
        price: "$coinDetails.price",
        marketCap: "$coinDetails.marketCap",
        rank: "$coinDetails.rank",
      },
    },
  ]);

  return trending;
};
