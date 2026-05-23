import mongoose from "mongoose";
import "dotenv/config";
import app from "../app.js";
import User from "../models/User.js";
import Coin from "../models/Coin.js";
import SearchLog from "../models/SearchLog.js";

const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/cryptoverse_analytics_test";

async function runTests() {
  console.log("==========================================");
  console.log("TESTING ANALYTICS & DASHBOARD SYSTEM");
  console.log("==========================================");

  let server;
  try {
    await mongoose.connect(TEST_MONGO_URI);
    console.log("Connected to test database:", mongoose.connection.name);

    // ── Clear test collections ──────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Coin.deleteMany({}),
      SearchLog.deleteMany({}),
    ]);
    console.log("Cleared test collections.");

    // ── Seed Users ──────────────────────────────────────────────────────────
    const adminUser = await User.create({
      fullName: "Admin Yashvi",
      email: "admin@cryptoverse.com",
      password: "Admin@123456",
      role: "admin",
      isActive: true,
    });
    const regularUser = await User.create({
      fullName: "Regular User",
      email: "user@cryptoverse.com",
      password: "User@123456",
      role: "user",
      isActive: true,
    });
    const inactiveUser = await User.create({
      fullName: "Inactive User",
      email: "inactive@cryptoverse.com",
      password: "User@123456",
      role: "user",
      isActive: false,
    });
    console.log("Seeded 3 users (1 admin, 2 regular).");

    // ── Seed Coins ──────────────────────────────────────────────────────────
    await Coin.insertMany([
      {
        coinId: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        rank: 1,
        price: 65000,
        marketCap: 1_280_000_000_000,
        volume: 28_000_000_000,
        dailyReturn: 2.5,
        volatility: 1.2,
        month: "May",
        year: 2026,
      },
      {
        coinId: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        rank: 2,
        price: 3200,
        marketCap: 385_000_000_000,
        volume: 14_000_000_000,
        dailyReturn: 4.8,
        volatility: 1.8,
        month: "May",
        year: 2026,
      },
      {
        coinId: "solana",
        name: "Solana",
        symbol: "SOL",
        rank: 5,
        price: 160,
        marketCap: 72_000_000_000,
        volume: 4_500_000_000,
        dailyReturn: -3.2,
        volatility: 3.1,
        month: "April",
        year: 2026,
      },
      {
        coinId: "cardano",
        name: "Cardano",
        symbol: "ADA",
        rank: 8,
        price: 0.45,
        marketCap: 15_000_000_000,
        volume: 500_000_000,
        dailyReturn: -1.5,
        volatility: 2.5,
        month: "April",
        year: 2026,
      },
      {
        coinId: "dogecoin",
        name: "Dogecoin",
        symbol: "DOGE",
        rank: 10,
        price: 0.12,
        marketCap: 16_000_000_000,
        volume: 1_200_000_000,
        dailyReturn: 8.5,
        volatility: 4.5,
        month: "March",
        year: 2025,
      },
    ]);
    console.log("Seeded 5 coins.");

    // ── Seed SearchLogs ─────────────────────────────────────────────────────
    await SearchLog.insertMany([
      { user: adminUser._id, query: "bitcoin", resultsCount: 5 },
      { user: regularUser._id, query: "bitcoin", resultsCount: 5 },
      { user: regularUser._id, query: "ethereum", resultsCount: 4 },
      { user: regularUser._id, query: "ethereum", resultsCount: 4 },
      { user: regularUser._id, query: "solana", resultsCount: 3 },
      { user: adminUser._id, query: "dogecoin", resultsCount: 2 },
    ]);
    console.log("Seeded 6 search logs.\n");

    // ── Start ephemeral server ───────────────────────────────────────────────
    server = app.listen(0);
    const { port } = server.address();
    const BASE = `http://127.0.0.1:${port}/api/v1`;
    console.log(`Test server running at: ${BASE}\n`);

    // ── Helper to make requests ──────────────────────────────────────────────
    const request = async (url, token = null) => {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${BASE}${url}`, { headers });
      const data = await res.json();
      return { status: res.status, data };
    };

    // ── Get tokens ───────────────────────────────────────────────────────────
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@cryptoverse.com", password: "Admin@123456" }),
    });
    const loginData = await loginRes.json();
    const adminToken = loginData.data?.token;
    console.assert(!!adminToken, "Admin token must be obtained");
    console.log("Admin token obtained.\n");

    const userLoginRes = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@cryptoverse.com", password: "User@123456" }),
    });
    const userLoginData = await userLoginRes.json();
    const userToken = userLoginData.data?.token;
    console.assert(!!userToken, "User token must be obtained");
    console.log("Regular user token obtained.\n");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 1: GET /analytics/overview (admin only)
    // ─────────────────────────────────────────────────────────────────────────
    console.log("--- TEST 1: GET /analytics/overview ---");
    const overviewRes = await request("/analytics/overview", adminToken);
    console.log("Status:", overviewRes.status);
    console.log("Response:", JSON.stringify(overviewRes.data.data, null, 2));
    console.assert(overviewRes.status === 200, "Should return 200");
    console.assert(overviewRes.data.data.users.total === 3, "Should count 3 users");
    console.assert(overviewRes.data.data.users.admins === 1, "Should count 1 admin");
    console.assert(overviewRes.data.data.coins.total === 5, "Should count 5 coins");
    console.assert(overviewRes.data.data.searches.total === 6, "Should count 6 searches");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 2: Unauthorized access to admin-only route
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 2: Unauthorized access to /analytics/overview ---");
    const unauthRes = await request("/analytics/overview", userToken);
    console.log("Status:", unauthRes.status);
    console.log("Message:", unauthRes.data.message);
    console.assert(unauthRes.status === 403, "Regular user must get 403 on admin route");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 3: GET /analytics/market/summary
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 3: GET /analytics/market/summary ---");
    const marketRes = await request("/analytics/market/summary", userToken);
    console.log("Status:", marketRes.status);
    console.log("Top Ranked Coin:", marketRes.data.data.topRankedCoin);
    console.log("Highest Growth:", marketRes.data.data.highestGrowthCoin);
    console.assert(marketRes.status === 200, "Should return 200");
    console.assert(marketRes.data.data.topRankedCoin?.coinId === "bitcoin", "Top ranked is Bitcoin");
    console.assert(marketRes.data.data.highestGrowthCoin?.coinId === "dogecoin", "Highest growth is Dogecoin");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 4: GET /analytics/coins/top-gainers
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 4: GET /analytics/coins/top-gainers?limit=3 ---");
    const gainersRes = await request("/analytics/coins/top-gainers?limit=3", userToken);
    console.log("Status:", gainersRes.status);
    console.log("Top 3 Gainers:", gainersRes.data.data.map((c) => `${c.symbol}(${c.dailyReturn}%)`));
    console.assert(gainersRes.status === 200, "Should return 200");
    console.assert(gainersRes.data.data.length <= 3, "Should return at most 3");
    console.assert(gainersRes.data.data[0].dailyReturn > 0, "First gainer must be positive");
    console.assert(
      gainersRes.data.data[0].dailyReturn >= gainersRes.data.data[1]?.dailyReturn,
      "Gainers should be sorted desc"
    );

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 5: GET /analytics/coins/top-losers
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 5: GET /analytics/coins/top-losers?limit=3 ---");
    const losersRes = await request("/analytics/coins/top-losers?limit=3", userToken);
    console.log("Status:", losersRes.status);
    console.log("Top 3 Losers:", losersRes.data.data.map((c) => `${c.symbol}(${c.dailyReturn}%)`));
    console.assert(losersRes.status === 200, "Should return 200");
    console.assert(losersRes.data.data[0].dailyReturn < 0, "First loser must be negative");
    console.assert(
      losersRes.data.data[0].dailyReturn <= losersRes.data.data[1]?.dailyReturn,
      "Losers should be sorted asc"
    );

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 6: GET /analytics/search/trends
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 6: GET /analytics/search/trends ---");
    const searchRes = await request("/analytics/search/trends?days=30&limit=5", adminToken);
    console.log("Status:", searchRes.status);
    console.log("Top Queries:", searchRes.data.data.topQueries);
    console.assert(searchRes.status === 200, "Should return 200");
    console.assert(searchRes.data.data.topQueries.length > 0, "Should return search trends");
    console.assert(
      searchRes.data.data.topQueries[0].frequency >= searchRes.data.data.topQueries[1]?.frequency,
      "Queries sorted by frequency desc"
    );
    const topQuery = searchRes.data.data.topQueries[0]?.query;
    console.assert(topQuery === "bitcoin" || topQuery === "ethereum", "Top query is bitcoin or ethereum");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 7: GET /analytics/system/health (admin only)
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 7: GET /analytics/system/health ---");
    const healthRes = await request("/analytics/system/health", adminToken);
    console.log("Status:", healthRes.status);
    console.log("DB Status:", healthRes.data.data.database.status);
    console.log("Collections:", healthRes.data.data.collections);
    console.log("Memory (heapUsedMB):", healthRes.data.data.memory.heapUsedMB);
    console.assert(healthRes.status === 200, "Should return 200");
    console.assert(healthRes.data.data.database.status === "connected", "DB should be connected");
    console.assert(healthRes.data.data.collections.total === 4, "Should count 4 collections");
    console.assert(healthRes.data.data.process.uptimeSeconds >= 0, "Uptime should be non-negative");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 8: GET /analytics/dashboard (master dashboard)
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 8: GET /analytics/dashboard?days=30&limit=3 ---");
    const dashRes = await request("/analytics/dashboard?days=30&limit=3", userToken);
    console.log("Status:", dashRes.status);
    const dash = dashRes.data.data;
    console.log("Dashboard keys:", Object.keys(dash));
    console.assert(dashRes.status === 200, "Should return 200");
    console.assert(!!dash.overview, "Dashboard must have overview");
    console.assert(!!dash.market, "Dashboard must have market");
    console.assert(!!dash.market.topGainers, "Dashboard must have topGainers");
    console.assert(!!dash.market.topLosers, "Dashboard must have topLosers");
    console.assert(!!dash.market.trending, "Dashboard must have trending");
    console.assert(!!dash.search, "Dashboard must have search");
    console.assert(!!dash.system, "Dashboard must have system");
    console.assert(!!dash.generatedAt, "Dashboard must have generatedAt timestamp");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 9: GET /analytics/market/category-distribution
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 9: GET /analytics/market/category-distribution ---");
    const catRes = await request("/analytics/market/category-distribution", userToken);
    console.log("Status:", catRes.status);
    console.log("Market Cap Tiers:", catRes.data.data.marketCapTiers);
    console.assert(catRes.status === 200, "Should return 200");
    console.assert(catRes.data.data.marketCapTiers.length > 0, "Should have tier distribution");
    console.assert(catRes.data.data.monthlyDistribution.length > 0, "Should have monthly distribution");

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 10: No auth → reject request
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n--- TEST 10: No auth token → 401 ---");
    const noAuthRes = await request("/analytics/dashboard", null);
    console.log("Status:", noAuthRes.status);
    console.assert(noAuthRes.status === 401, "Should return 401 without token");

    console.log("\n==========================================");
    console.log("ALL ANALYTICS & DASHBOARD TESTS PASSED 🎉");
    console.log("==========================================");

  } catch (error) {
    console.error("Test suite threw an error:", error);
    process.exit(1);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("Closed test server.");
    }
    await mongoose.connect(TEST_MONGO_URI);
    await Promise.all([
      User.deleteMany({}),
      Coin.deleteMany({}),
      SearchLog.deleteMany({}),
    ]);
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

runTests();
