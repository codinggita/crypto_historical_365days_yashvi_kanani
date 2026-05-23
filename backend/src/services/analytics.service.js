import mongoose from "mongoose";
import os from "os";
import Coin from "../models/Coin.js";
import User from "../models/User.js";
import SearchLog from "../models/SearchLog.js";
import AuditLog from "../models/AuditLog.js";

// ─── Helper: parse ?days query param ──────────────────────────────────────────
const daysFilter = (days) => {
  if (!days) return {};
  const since = new Date();
  since.setDate(since.getDate() - parseInt(days, 10));
  return { createdAt: { $gte: since } };
};

// ─── Helper: parse ?limit query param ─────────────────────────────────────────
const parseLimit = (limit, defaultVal = 10) =>
  Math.min(Math.max(parseInt(limit, 10) || defaultVal, 1), 100);

// ─── 1. GET /analytics/overview ───────────────────────────────────────────────
/**
 * Platform-wide overview combining Users, Coins, and SearchLogs
 * Uses parallel aggregation via Promise.all for performance
 */
export const getOverview = async ({ days } = {}) => {
  const dateFilter = daysFilter(days);

  const [userStats, coinStats, searchStats] = await Promise.all([
    // User statistics via $facet
    User.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          activeUsers: [{ $match: { isActive: true } }, { $count: "count" }],
          adminCount: [{ $match: { role: "admin" } }, { $count: "count" }],
          newUsers: [
            { $match: { ...dateFilter } },
            { $count: "count" },
          ],
        },
      },
    ]),

    // Coin statistics via $facet
    Coin.aggregate([
      {
        $facet: {
          totalCoins: [{ $group: { _id: "$coinId" } }, { $count: "count" }],
          globalStats: [
            {
              $group: {
                _id: null,
                totalMarketCap: { $sum: "$marketCap" },
                totalVolume: { $sum: "$volume" },
                avgPrice: { $avg: "$price" },
              },
            },
          ],
        },
      },
    ]),

    // Search log statistics
    SearchLog.aggregate([
      {
        $facet: {
          totalSearches: [{ $count: "count" }],
          recentSearches: [
            { $match: { ...dateFilter } },
            { $count: "count" },
          ],
        },
      },
    ]),
  ]);

  const u = userStats[0] || {};
  const c = coinStats[0] || {};
  const s = searchStats[0] || {};
  const globalStats = c.globalStats?.[0] || {};

  return {
    users: {
      total: u.totalUsers?.[0]?.count || 0,
      active: u.activeUsers?.[0]?.count || 0,
      admins: u.adminCount?.[0]?.count || 0,
      newInPeriod: u.newUsers?.[0]?.count || 0,
    },
    coins: {
      total: c.totalCoins?.[0]?.count || 0,
      totalMarketCap: globalStats.totalMarketCap || 0,
      totalVolume: globalStats.totalVolume || 0,
      avgPrice: globalStats.avgPrice || 0,
    },
    searches: {
      total: s.totalSearches?.[0]?.count || 0,
      inPeriod: s.recentSearches?.[0]?.count || 0,
    },
    period: days ? `Last ${days} days` : "All time",
  };
};

// ─── 2. GET /analytics/market/summary ─────────────────────────────────────────
/**
 * Full market statistics using $facet for parallel computation
 * Returns chart-ready data for dashboard cards
 */
export const getMarketSummary = async ({ category } = {}) => {
  const matchStage = category
    ? { $match: { month: new RegExp(category, "i") } }
    : { $match: {} };

  const result = await Coin.aggregate([
    matchStage,
    {
      $facet: {
        globalStats: [
          {
            $group: {
              _id: null,
              totalMarketCap: { $sum: "$marketCap" },
              totalVolume: { $sum: "$volume" },
              avgPrice: { $avg: "$price" },
              avgVolatility: { $avg: "$volatility" },
              avgDailyReturn: { $avg: "$dailyReturn" },
              coinCount: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              totalMarketCap: 1,
              totalVolume: 1,
              avgPrice: { $round: ["$avgPrice", 2] },
              avgVolatility: { $round: ["$avgVolatility", 4] },
              avgDailyReturn: { $round: ["$avgDailyReturn", 4] },
              coinCount: 1,
            },
          },
        ],
        topRankedCoin: [
          { $sort: { rank: 1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              coinId: 1,
              name: 1,
              symbol: 1,
              rank: 1,
              price: 1,
              marketCap: 1,
            },
          },
        ],
        highestGrowthCoin: [
          { $sort: { dailyReturn: -1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              coinId: 1,
              name: 1,
              symbol: 1,
              dailyReturn: 1,
              price: 1,
            },
          },
        ],
        marketSentiment: [
          {
            $group: {
              _id: null,
              bullish: { $sum: { $cond: [{ $gt: ["$dailyReturn", 0] }, 1, 0] } },
              bearish: { $sum: { $cond: [{ $lt: ["$dailyReturn", 0] }, 1, 0] } },
              neutral: { $sum: { $cond: [{ $eq: ["$dailyReturn", 0] }, 1, 0] } },
            },
          },
          { $project: { _id: 0, bullish: 1, bearish: 1, neutral: 1 } },
        ],
      },
    },
  ]);

  const d = result[0] || {};
  return {
    globalStats: d.globalStats?.[0] || {},
    topRankedCoin: d.topRankedCoin?.[0] || null,
    highestGrowthCoin: d.highestGrowthCoin?.[0] || null,
    marketSentiment: d.marketSentiment?.[0] || { bullish: 0, bearish: 0, neutral: 0 },
  };
};

// ─── 3. GET /analytics/coins/top-gainers ──────────────────────────────────────
/**
 * Top gaining coins sorted by dailyReturn desc
 * Supports ?limit and ?days filters
 */
export const getTopGainers = async ({ limit = 10 } = {}) => {
  const n = parseLimit(limit);
  return await Coin.aggregate([
    { $match: { dailyReturn: { $gt: 0 } } },
    { $sort: { dailyReturn: -1 } },
    { $limit: n },
    {
      $project: {
        _id: 0,
        coinId: 1,
        name: 1,
        symbol: 1,
        price: 1,
        dailyReturn: 1,
        volume: 1,
        marketCap: 1,
        rank: 1,
      },
    },
  ]);
};

// ─── 4. GET /analytics/coins/top-losers ───────────────────────────────────────
/**
 * Top losing coins sorted by dailyReturn asc
 */
export const getTopLosers = async ({ limit = 10 } = {}) => {
  const n = parseLimit(limit);
  return await Coin.aggregate([
    { $match: { dailyReturn: { $lt: 0 } } },
    { $sort: { dailyReturn: 1 } },
    { $limit: n },
    {
      $project: {
        _id: 0,
        coinId: 1,
        name: 1,
        symbol: 1,
        price: 1,
        dailyReturn: 1,
        volume: 1,
        marketCap: 1,
        rank: 1,
      },
    },
  ]);
};

// ─── 5. GET /analytics/coins/trending ─────────────────────────────────────────
/**
 * Trending coins based on:
 *   - Highest search frequency (from SearchLog)
 *   - Highest trading volume (from Coin)
 * Uses $lookup to join SearchLog query counts to Coin records
 */
export const getTrendingCoins = async ({ limit = 10 } = {}) => {
  const n = parseLimit(limit);

  // Step A: get top searched coin names from SearchLog
  const searchTrends = await SearchLog.aggregate([
    {
      $group: {
        _id: { $toLower: "$query" },
        searchCount: { $sum: 1 },
      },
    },
    { $sort: { searchCount: -1 } },
    { $limit: 50 },
    { $project: { _id: 0, query: "$_id", searchCount: 1 } },
  ]);

  const topQueries = searchTrends.map((s) => s.query);

  // Step B: combine search frequency score + volume score on Coin collection
  const trendingByVolume = await Coin.aggregate([
    { $sort: { volume: -1 } },
    { $limit: n },
    {
      $project: {
        _id: 0,
        coinId: 1,
        name: 1,
        symbol: 1,
        price: 1,
        volume: 1,
        dailyReturn: 1,
        marketCap: 1,
        rank: 1,
        trendScore: "$volume",
      },
    },
  ]);

  // Annotate with search count
  return trendingByVolume.map((coin) => {
    const match = searchTrends.find(
      (s) =>
        s.query === coin.name.toLowerCase() ||
        s.query === coin.symbol.toLowerCase() ||
        s.query === coin.coinId.toLowerCase()
    );
    return {
      ...coin,
      searchFrequency: match?.searchCount || 0,
    };
  });
};

// ─── 6. GET /analytics/users/growth ───────────────────────────────────────────
/**
 * Monthly user registration growth using $group on createdAt
 * Returns chart-ready array for line/bar charts
 */
export const getUserGrowth = async ({ days } = {}) => {
  const matchFilter = days
    ? { createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } }
    : {};

  return await User.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        newUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
        adminUsers: { $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        label: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" },
              ],
            },
          ],
        },
        newUsers: 1,
        activeUsers: 1,
        adminUsers: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);
};

// ─── 7. GET /analytics/search/trends ──────────────────────────────────────────
/**
 * Search trend analytics from SearchLog collection
 * Returns: most searched queries, daily search counts
 */
export const getSearchTrends = async ({ days = 30, limit = 10 } = {}) => {
  const n = parseLimit(limit);
  const since = new Date(Date.now() - parseInt(days, 10) * 24 * 60 * 60 * 1000);

  const result = await SearchLog.aggregate([
    {
      $facet: {
        topQueries: [
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: "$query",
              frequency: { $sum: 1 },
              lastSearched: { $max: "$createdAt" },
            },
          },
          { $sort: { frequency: -1 } },
          { $limit: n },
          {
            $project: {
              _id: 0,
              query: "$_id",
              frequency: 1,
              lastSearched: 1,
            },
          },
        ],
        dailyCounts: [
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
              count: 1,
            },
          },
          { $sort: { date: 1 } },
        ],
        totalSearches: [
          { $match: { createdAt: { $gte: since } } },
          { $count: "count" },
        ],
        uniqueQueries: [
          { $match: { createdAt: { $gte: since } } },
          { $group: { _id: "$query" } },
          { $count: "count" },
        ],
      },
    },
  ]);

  const d = result[0] || {};
  return {
    topQueries: d.topQueries || [],
    dailyCounts: d.dailyCounts || [],
    totalSearches: d.totalSearches?.[0]?.count || 0,
    uniqueQueries: d.uniqueQueries?.[0]?.count || 0,
    period: `Last ${days} days`,
  };
};

// ─── 8. GET /analytics/bookmarks/stats ────────────────────────────────────────
/**
 * Bookmark-equivalent analytics using SearchLog as a proxy
 * (most revisited queries = effectively bookmarked interest)
 * Plus coin price-tier distribution as category proxy
 */
export const getBookmarkStats = async ({ days = 30, limit = 10 } = {}) => {
  const n = parseLimit(limit);
  const since = new Date(Date.now() - parseInt(days, 10) * 24 * 60 * 60 * 1000);

  const [searchStats, coinDistribution] = await Promise.all([
    SearchLog.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$query",
          bookmarkCount: { $sum: 1 },
          uniqueUsers: { $addToSet: "$user" },
          lastActivity: { $max: "$createdAt" },
          firstActivity: { $min: "$createdAt" },
        },
      },
      { $sort: { bookmarkCount: -1 } },
      { $limit: n },
      {
        $project: {
          _id: 0,
          coinQuery: "$_id",
          bookmarkCount: 1,
          uniqueUserCount: { $size: "$uniqueUsers" },
          lastActivity: 1,
          firstActivity: 1,
        },
      },
    ]),

    // Price-tier distribution (acts as category distribution)
    Coin.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$price", 1] }, then: "Micro (<$1)" },
                { case: { $lte: ["$price", 100] }, then: "Small ($1-$100)" },
                { case: { $lte: ["$price", 1000] }, then: "Mid ($100-$1K)" },
                { case: { $lte: ["$price", 10000] }, then: "Large ($1K-$10K)" },
              ],
              default: "Mega (>$10K)",
            },
          },
          count: { $sum: 1 },
          totalMarketCap: { $sum: "$marketCap" },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          tier: "$_id",
          count: 1,
          totalMarketCap: 1,
        },
      },
    ]),
  ]);

  return {
    mostInteractedCoins: searchStats,
    priceTierDistribution: coinDistribution,
    period: `Last ${days} days`,
  };
};

// ─── 9. GET /analytics/market/category-distribution ───────────────────────────
/**
 * Market cap tier distribution — chart-ready for pie/bar charts
 * Groups coins by market cap tier with aggregate stats per tier
 */
export const getCategoryDistribution = async () => {
  const [tierDist, monthlyDist, yearlyDist] = await Promise.all([
    // Market cap tier distribution
    Coin.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                {
                  case: { $gte: ["$marketCap", 10_000_000_000] },
                  then: "Large Cap (>$10B)",
                },
                {
                  case: { $gte: ["$marketCap", 1_000_000_000] },
                  then: "Mid Cap ($1B-$10B)",
                },
                {
                  case: { $gte: ["$marketCap", 100_000_000] },
                  then: "Small Cap ($100M-$1B)",
                },
              ],
              default: "Micro Cap (<$100M)",
            },
          },
          count: { $sum: 1 },
          totalMarketCap: { $sum: "$marketCap" },
          avgPrice: { $avg: "$price" },
          avgDailyReturn: { $avg: "$dailyReturn" },
        },
      },
      { $sort: { totalMarketCap: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
          totalMarketCap: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          avgDailyReturn: { $round: ["$avgDailyReturn", 4] },
        },
      },
    ]),

    // Monthly coin data distribution (for line charts)
    Coin.aggregate([
      {
        $group: {
          _id: "$month",
          coinCount: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          avgMarketCap: { $avg: "$marketCap" },
          avgVolume: { $avg: "$volume" },
          avgDailyReturn: { $avg: "$dailyReturn" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id",
          coinCount: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          avgMarketCap: 1,
          avgVolume: 1,
          avgDailyReturn: { $round: ["$avgDailyReturn", 4] },
        },
      },
    ]),

    // Yearly distribution
    Coin.aggregate([
      {
        $group: {
          _id: "$year",
          coinCount: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalMarketCap: { $sum: "$marketCap" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id",
          coinCount: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          totalMarketCap: 1,
        },
      },
    ]),
  ]);

  return {
    marketCapTiers: tierDist,
    monthlyDistribution: monthlyDist,
    yearlyDistribution: yearlyDist,
  };
};

// ─── 10. GET /analytics/system/health ─────────────────────────────────────────
/**
 * System health monitoring — DB status, memory, uptime, env
 */
export const getSystemHealth = async () => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

  const memUsage = process.memoryUsage();
  const toMB = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;

  // Count documents in all collections
  const [userCount, coinCount, searchCount, auditCount] = await Promise.all([
    User.estimatedDocumentCount(),
    Coin.estimatedDocumentCount(),
    SearchLog.estimatedDocumentCount(),
    AuditLog.estimatedDocumentCount(),
  ]);

  return {
    database: {
      status: dbStateMap[dbState] || "unknown",
      name: mongoose.connection.name || "unknown",
      host: mongoose.connection.host || "unknown",
    },
    collections: {
      users: userCount,
      coins: coinCount,
      searchLogs: searchCount,
      auditLogs: auditCount,
      total: 4,
    },
    memory: {
      heapUsedMB: toMB(memUsage.heapUsed),
      heapTotalMB: toMB(memUsage.heapTotal),
      rssMB: toMB(memUsage.rss),
      externalMB: toMB(memUsage.external),
    },
    process: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || "development",
      pid: process.pid,
      cpuCount: os.cpus().length,
      totalMemoryMB: toMB(os.totalmem()),
      freeMemoryMB: toMB(os.freemem()),
    },
    timestamp: new Date().toISOString(),
  };
};

// ─── 11. GET /analytics/dashboard ─────────────────────────────────────────────
/**
 * Master dashboard — combines all analytics in one optimized call
 * Runs all sub-queries in parallel via Promise.all for minimum latency
 */
export const getDashboard = async ({ days = 30, limit = 5 } = {}) => {
  const [
    overview,
    marketSummary,
    topGainers,
    topLosers,
    trending,
    userGrowth,
    searchTrends,
    categoryDist,
    systemHealth,
  ] = await Promise.all([
    getOverview({ days }),
    getMarketSummary(),
    getTopGainers({ limit }),
    getTopLosers({ limit }),
    getTrendingCoins({ limit }),
    getUserGrowth({ days }),
    getSearchTrends({ days, limit }),
    getCategoryDistribution(),
    getSystemHealth(),
  ]);

  return {
    overview,
    market: {
      summary: marketSummary,
      topGainers,
      topLosers,
      trending,
      categoryDistribution: categoryDist.marketCapTiers,
    },
    users: {
      growth: userGrowth,
    },
    search: {
      trends: searchTrends,
    },
    system: systemHealth,
    generatedAt: new Date().toISOString(),
    period: `Last ${days} days`,
  };
};
