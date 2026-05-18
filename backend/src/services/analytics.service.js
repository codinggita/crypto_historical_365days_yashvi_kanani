import Coin from "../models/Coin.js";

/**
 * Get market overview statistics using an aggregation pipeline with $facet
 */
export const getOverview = async () => {
  const result = await Coin.aggregate([
    {
      $facet: {
        globalStats: [
          {
            $group: {
              _id: null,
              averagePrice: { $avg: "$price" },
              totalMarketCap: { $sum: "$marketCap" },
              averageVolume: { $avg: "$volume" },
            },
          },
        ],
        uniqueCoins: [
          { $group: { _id: "$coinId" } },
          { $count: "count" },
        ],
        highestPrice: [
          { $sort: { price: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, coinId: 1, name: 1, symbol: 1, price: 1 } },
        ],
        lowestPrice: [
          { $sort: { price: 1 } },
          { $limit: 1 },
          { $project: { _id: 0, coinId: 1, name: 1, symbol: 1, price: 1 } },
        ],
        uniqueMonths: [
          { $group: { _id: "$month" } },
          { $count: "count" },
        ],
      },
    },
  ]);

  const facetData = result[0] || {};
  const global = facetData.globalStats?.[0] || {};

  return {
    totalCoins: facetData.uniqueCoins?.[0]?.count || 0,
    averagePrice: global.averagePrice || 0,
    totalMarketCap: global.totalMarketCap || 0,
    averageVolume: global.averageVolume || 0,
    highestPricedCoin: facetData.highestPrice?.[0] || null,
    lowestPricedCoin: facetData.lowestPrice?.[0] || null,
    totalMonthsAvailable: facetData.uniqueMonths?.[0]?.count || 0,
  };
};

/**
 * Get top 10 gainers by highest dailyReturn
 */
export const getTopGainers = async () => {
  return await Coin.aggregate([
    { $sort: { dailyReturn: -1 } },
    { $limit: 10 },
  ]);
};

/**
 * Get top 10 losers by lowest dailyReturn
 */
export const getTopLosers = async () => {
  return await Coin.aggregate([
    { $sort: { dailyReturn: 1 } },
    { $limit: 10 },
  ]);
};

/**
 * Get top 10 highest market cap coins
 */
export const getHighestMarketCap = async () => {
  return await Coin.aggregate([
    { $sort: { marketCap: -1 } },
    { $limit: 10 },
  ]);
};

/**
 * Get top 10 highest traded volume coins
 */
export const getHighestVolume = async () => {
  return await Coin.aggregate([
    { $sort: { volume: -1 } },
    { $limit: 10 },
  ]);
};

/**
 * Get top 10 high volatility coins
 */
export const getHighVolatility = async () => {
  return await Coin.aggregate([
    { $sort: { volatility: -1 } },
    { $limit: 10 },
  ]);
};

/**
 * Get monthly report: average price, marketCap, volume, dailyReturn grouped by month
 */
export const getMonthlyReport = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: { $toLower: "$month" },
        avgPrice: { $avg: "$price" },
        avgMarketCap: { $avg: "$marketCap" },
        avgVolume: { $avg: "$volume" },
        avgDailyReturn: { $avg: "$dailyReturn" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        avgPrice: 1,
        avgMarketCap: 1,
        avgVolume: 1,
        avgDailyReturn: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);
};

/**
 * Get yearly report grouped by year
 */
export const getYearlyReport = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: "$year",
        avgPrice: { $avg: "$price" },
        avgMarketCap: { $avg: "$marketCap" },
        avgVolume: { $avg: "$volume" },
        avgDailyReturn: { $avg: "$dailyReturn" },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        avgPrice: 1,
        avgMarketCap: 1,
        avgVolume: 1,
        avgDailyReturn: 1,
      },
    },
    { $sort: { year: 1 } },
  ]);
};

/**
 * Get market summary (bullish, bearish, neutral counts)
 */
export const getMarketSummary = async () => {
  const result = await Coin.aggregate([
    {
      $group: {
        _id: null,
        bullish: {
          $sum: { $cond: [{ $gt: ["$dailyReturn", 0] }, 1, 0] },
        },
        bearish: {
          $sum: { $cond: [{ $lt: ["$dailyReturn", 0] }, 1, 0] },
        },
        neutral: {
          $sum: { $cond: [{ $eq: ["$dailyReturn", 0] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        bullish: 1,
        bearish: 1,
        neutral: 1,
      },
    },
  ]);

  return result[0] || { bullish: 0, bearish: 0, neutral: 0 };
};

/**
 * Get price ranges distribution (0-100, 101-1000, 1001-10000, 10000+) using $cond buckets
 */
export const getPriceRanges = async () => {
  return await Coin.aggregate([
    {
      $project: {
        range: {
          $cond: [
            { $lte: ["$price", 100] },
            "0-100",
            {
              $cond: [
                { $lte: ["$price", 1000] },
                "101-1000",
                {
                  $cond: [
                    { $lte: ["$price", 10000] },
                    "1001-10000",
                    "10000+",
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$range",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        range: "$_id",
        count: 1,
      },
    },
    { $sort: { range: 1 } },
  ]);
};
