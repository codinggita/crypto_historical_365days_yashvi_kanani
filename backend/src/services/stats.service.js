import Coin from "../models/Coin.js";

export const getTotalMarketCap = async () => {
  const result = await Coin.aggregate([
    {
      $group: {
        _id: null,
        totalMarketCap: { $sum: "$marketCap" },
      },
    },
  ]);
  return result[0]?.totalMarketCap || 0;
};

export const getAveragePrice = async () => {
  const result = await Coin.aggregate([
    {
      $group: {
        _id: null,
        averagePrice: { $avg: "$price" },
      },
    },
  ]);
  return result[0]?.averagePrice || 0;
};

export const getAverageVolume = async () => {
  const result = await Coin.aggregate([
    {
      $group: {
        _id: null,
        averageVolume: { $avg: "$volume" },
      },
    },
  ]);
  return result[0]?.averageVolume || 0;
};

export const getHighestMarketCap = async () => {
  return await Coin.findOne({}).sort({ marketCap: -1 });
};

export const getHighestVolume = async () => {
  return await Coin.findOne({}).sort({ volume: -1 });
};

export const getTopGainers = async (limit = 10) => {
  return await Coin.find({}).sort({ dailyReturn: -1 }).limit(limit);
};

export const getTopLosers = async (limit = 10) => {
  return await Coin.find({}).sort({ dailyReturn: 1 }).limit(limit);
};

export const getCoinCount = async () => {
  const uniqueCoins = await Coin.distinct("coinId");
  return uniqueCoins.length;
};

export const getRankDistribution = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lte: ["$rank", 10] }, then: "Top 10" },
              { case: { $lte: ["$rank", 50] }, then: "Rank 11-50" },
              { case: { $lte: ["$rank", 100] }, then: "Rank 51-100" },
            ],
            default: "Rank 100+",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

export const getPriceDistribution = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lte: ["$price", 1] }, then: "Penny (<$1)" },
              { case: { $lte: ["$price", 100] }, then: "Low ($1-$100)" },
              { case: { $lte: ["$price", 1000] }, then: "Medium ($100-$1K)" },
            ],
            default: "High (>$1K)",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

export const getVolatilityDistribution = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lte: ["$volatility", 1.5] }, then: "Low Volatility (<1.5%)" },
              { case: { $lte: ["$volatility", 3.0] }, then: "Medium Volatility (1.5%-3%)" },
            ],
            default: "High Volatility (>3%)",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

export const getMarketSummary = async () => {
  const result = await Coin.aggregate([
    {
      $group: {
        _id: null,
        totalMarketCap: { $sum: "$marketCap" },
        averagePrice: { $avg: "$price" },
        averageVolume: { $avg: "$volume" },
        coinCount: { $sum: 1 },
      },
    },
  ]);
  return result[0] || { totalMarketCap: 0, averagePrice: 0, averageVolume: 0, coinCount: 0 };
};

export const getDailyAnalysis = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" },
        },
        averagePrice: { $avg: "$price" },
        totalVolume: { $sum: "$volume" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
  ]);
};

export const getMonthlyAnalysis = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
        },
        averagePrice: { $avg: "$price" },
        totalVolume: { $sum: "$volume" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);
};

export const getYearlyAnalysis = async () => {
  return await Coin.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
        },
        averagePrice: { $avg: "$price" },
        totalVolume: { $sum: "$volume" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1 } },
  ]);
};
