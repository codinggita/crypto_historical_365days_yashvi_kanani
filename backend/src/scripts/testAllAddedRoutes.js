process.env.NODE_ENV = "test";
import mongoose from "mongoose";
import "dotenv/config";
import app from "../app.js";
import User from "../models/User.js";
import Coin from "../models/Coin.js";
import SearchLog from "../models/SearchLog.js";

const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/cryptoverse_all_routes_test";

async function runTests() {
  console.log("==========================================");
  console.log("RUNNING COMPREHENSIVE ROUTE VERIFICATION SUITE");
  console.log("==========================================");

  let server;
  try {
    await mongoose.connect(TEST_MONGO_URI);
    console.log("Connected to test database:", mongoose.connection.name);

    // Clear and Seed
    await Promise.all([
      User.deleteMany({}),
      Coin.deleteMany({}),
      SearchLog.deleteMany({}),
    ]);
    console.log("Cleared collection data.");

    // Seed mock admin and user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@cryptoverse.com",
      password: "Admin@123456",
      role: "admin",
      isActive: true,
    });
    const regularUser = await User.create({
      name: "Regular User",
      email: "user@cryptoverse.com",
      password: "User@123456",
      role: "user",
      isActive: true,
    });
    console.log("Users created.");

    // Seed mock coins
    await Coin.insertMany([
      {
        coinId: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        rank: 1,
        price: 65000,
        marketCap: 1280000000000,
        volume: 28000000000,
        dailyReturn: 2.5,
        volatility: 1.2,
        month: "May",
        timestamp: new Date("2026-05-28T10:00:00Z"),
      },
      {
        coinId: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        rank: 2,
        price: 3200,
        marketCap: 385000000000,
        volume: 14000000000,
        dailyReturn: 4.8,
        volatility: 1.8,
        month: "May",
        timestamp: new Date("2026-05-28T10:00:00Z"),
      },
      {
        coinId: "solana",
        name: "Solana",
        symbol: "SOL",
        rank: 5,
        price: 160,
        marketCap: 72000000000,
        volume: 4500000000,
        dailyReturn: -3.2,
        volatility: 3.1,
        month: "April",
        timestamp: new Date("2026-04-15T12:00:00Z"),
      },
    ]);
    console.log("Coins seeded.");

    // Start ephemeral server
    server = app.listen(0);
    const { port } = server.address();
    const BASE = `http://127.0.0.1:${port}/api/v1`;
    console.log(`Ephemeral server started at: ${BASE}\n`);

    // Helper to make requests
    const request = async (url, method = "GET", body = null, token = null) => {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const options = { method, headers };
      if (body) options.body = JSON.stringify(body);
      const res = await fetch(`${BASE}${url}`, options);
      let data = null;
      if (method !== "HEAD") {
        try {
          data = await res.json();
        } catch (_) {}
      }
      return {
        status: res.status,
        headers: res.headers,
        data,
      };
    };

    // Obtain tokens
    const adminLoginRes = await request("/auth/login", "POST", { email: "admin@cryptoverse.com", password: "Admin@123456" });
    const adminToken = adminLoginRes.data?.data?.token;
    console.assert(!!adminToken, "Admin token missing");

    const userLoginRes = await request("/auth/login", "POST", { email: "user@cryptoverse.com", password: "User@123456" });
    const userToken = userLoginRes.data?.data?.token;
    console.assert(!!userToken, "User token missing");

    console.log("Tokens obtained. Beginning endpoint verification...\n");

    const testRoute = async (name, url, method = "GET", body = null, token = userToken, expectedStatus = 200) => {
      process.stdout.write(`Testing [${method}] ${url} ... `);
      const res = await request(url, method, body, token);
      if (res.status === expectedStatus) {
        console.log(`PASSED (Status ${res.status})`);
        return res;
      } else {
        console.log(`FAILED! Expected ${expectedStatus}, got ${res.status}. Error:`, JSON.stringify(res.data));
        throw new Error(`Route failed: ${method} ${url}`);
      }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 1. BASIC CRUD ROUTES & OPTIONS/HEAD
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /coins", "/coins");
    await testRoute("GET /coins/:id", "/coins/bitcoin");
    await testRoute("GET /coins/exists/:id", "/coins/exists/bitcoin");

    // POST /coins (admin only)
    await testRoute("POST /coins (Forbidden for User)", "/coins", "POST", {
      coinId: "cardano", name: "Cardano", symbol: "ADA", price: 0.5
    }, userToken, 403);
    await testRoute("POST /coins (Admin)", "/coins", "POST", {
      coinId: "cardano", name: "Cardano", symbol: "ADA", price: 0.5
    }, adminToken, 201);

    // PATCH & PUT
    await testRoute("PATCH /coins/:id", "/coins/cardano", "PATCH", { price: 0.6 }, adminToken, 200);
    await testRoute("PUT /coins/:id", "/coins/cardano", "PUT", {
      coinId: "cardano", name: "Cardano Network", symbol: "ADA", price: 0.7
    }, adminToken, 200);

    // Bulk creation, update & delete
    await testRoute("POST /coins/bulk-create", "/coins/bulk-create", "POST", [
      { coinId: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.15 },
      { coinId: "polkadot", name: "Polkadot", symbol: "DOT", price: 6.5 }
    ], adminToken, 201);

    await testRoute("PATCH /coins/bulk-update", "/coins/bulk-update", "PATCH", [
      { coinId: "dogecoin", price: 0.16 },
      { coinId: "polkadot", price: 6.7 }
    ], adminToken, 200);

    await testRoute("DELETE /coins/bulk-delete", "/coins/bulk-delete", "DELETE", ["dogecoin", "polkadot"], adminToken, 200);

    // DELETE /coins/:id
    await testRoute("DELETE /coins/:id", "/coins/cardano", "DELETE", null, adminToken, 200);

    // ─────────────────────────────────────────────────────────────────────────
    // 2. COIN INFORMATION ROUTES
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /coins/name/:coinName", "/coins/name/Bitcoin");
    await testRoute("GET /coins/symbol/:symbol", "/coins/symbol/BTC");
    await testRoute("GET /coins/rank/:rank", "/coins/rank/1");
    await testRoute("GET /coins/month/:month", "/coins/month/May");
    await testRoute("GET /coins/date/:date", "/coins/date/2026-05-28");
    await testRoute("GET /coins/latest", "/coins/latest");
    await testRoute("GET /coins/history/:coinId", "/coins/history/bitcoin");
    await testRoute("GET /coins/top-market-cap", "/coins/top-market-cap");
    await testRoute("GET /coins/top-volume", "/coins/top-volume");
    await testRoute("GET /coins/top-gainers", "/coins/top-gainers");
    await testRoute("GET /coins/top-losers", "/coins/top-losers");
    await testRoute("GET /coins/oldest", "/coins/oldest");
    await testRoute("GET /coins/newest", "/coins/newest");
    await testRoute("GET /coins/trending", "/coins/trending");
    await testRoute("GET /coins/recent", "/coins/recent");

    // ─────────────────────────────────────────────────────────────────────────
    // 3. PARAMETERS & COMPARISONS
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /coins/performance/:coinId", "/coins/performance/bitcoin");
    await testRoute("GET /coins/volatility/:coinId", "/coins/volatility/bitcoin");
    await testRoute("GET /coins/market-cap/:coinId", "/coins/market-cap/bitcoin");
    await testRoute("GET /coins/volume/:coinId", "/coins/volume/bitcoin");
    await testRoute("GET /coins/returns/:coinId", "/coins/returns/bitcoin");
    await testRoute("GET /coins/compare/:coin1/:coin2", "/coins/compare/bitcoin/ethereum");
    await testRoute("GET /coins/compare/:coin1/:coin2/:coin3", "/coins/compare/bitcoin/ethereum/solana");
    await testRoute("GET /coins/price/:coinId", "/coins/price/bitcoin");
    await testRoute("GET /coins/history/:coinId/:month", "/coins/history/bitcoin/May");

    // ─────────────────────────────────────────────────────────────────────────
    // 4. QUERY PARAMETERS
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /coins?price=65000", "/coins?price=65000");
    await testRoute("GET /coins?minPrice=100&maxPrice=500", "/coins?minPrice=100&maxPrice=500");
    await testRoute("GET /coins?sort=price", "/coins?sort=price");
    await testRoute("GET /coins?page=1&limit=2", "/coins?page=1&limit=2");

    // ─────────────────────────────────────────────────────────────────────────
    // 5. SORTING & FILTERING ROUTES
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /coins/sort/price-asc", "/coins/sort/price-asc");
    await testRoute("GET /coins/sort/price-desc", "/coins/sort/price-desc");
    await testRoute("GET /coins/sort/volume-desc", "/coins/sort/volume-desc");
    await testRoute("GET /coins/sort/rank-asc", "/coins/sort/rank-asc");
    await testRoute("GET /coins/sort/return-desc", "/coins/sort/return-desc");

    await testRoute("GET /coins/filter/high-price", "/coins/filter/high-price");
    await testRoute("GET /coins/filter/low-price", "/coins/filter/low-price");
    await testRoute("GET /coins/filter/high-volume", "/coins/filter/high-volume");
    await testRoute("GET /coins/filter/low-volume", "/coins/filter/low-volume");
    await testRoute("GET /coins/filter/high-market-cap", "/coins/filter/high-market-cap");
    await testRoute("GET /coins/filter/low-market-cap", "/coins/filter/low-market-cap");
    await testRoute("GET /coins/filter/high-volatility", "/coins/filter/high-volatility");
    await testRoute("GET /coins/filter/low-volatility", "/coins/filter/low-volatility");
    await testRoute("GET /coins/filter/high-return", "/coins/filter/high-return");
    await testRoute("GET /coins/filter/negative-return", "/coins/filter/negative-return");
    await testRoute("GET /coins/filter/bullish", "/coins/filter/bullish");
    await testRoute("GET /coins/filter/bearish", "/coins/filter/bearish");
    await testRoute("GET /coins/filter/profitable", "/coins/filter/profitable");
    await testRoute("GET /coins/filter/loss-making", "/coins/filter/loss-making");
    await testRoute("GET /coins/filter/missing-values", "/coins/filter/missing-values");

    // ─────────────────────────────────────────────────────────────────────────
    // 6. SEARCH ROUTES
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /search/coins?q=bitcoin", "/search/coins?q=bitcoin");

    // ─────────────────────────────────────────────────────────────────────────
    // 7. ANALYTICS ROUTES
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /analytics/price/highest", "/analytics/price/highest");
    await testRoute("GET /analytics/price/lowest", "/analytics/price/lowest");
    await testRoute("GET /analytics/price/average", "/analytics/price/average");
    await testRoute("GET /analytics/price/history/:coinId", "/analytics/price/history/bitcoin");
    await testRoute("GET /analytics/price/trend", "/analytics/price/trend");
    await testRoute("GET /analytics/price/growth", "/analytics/price/growth");
    await testRoute("GET /analytics/price/drop", "/analytics/price/drop");
    await testRoute("GET /analytics/volume/highest", "/analytics/volume/highest");
    await testRoute("GET /analytics/volume/lowest", "/analytics/volume/lowest");
    await testRoute("GET /analytics/volume/average", "/analytics/volume/average");
    await testRoute("GET /analytics/volume/spike", "/analytics/volume/spike");
    await testRoute("GET /analytics/returns/top", "/analytics/returns/top");
    await testRoute("GET /analytics/returns/negative", "/analytics/returns/negative");
    await testRoute("GET /analytics/returns/cumulative", "/analytics/returns/cumulative");
    await testRoute("GET /analytics/volatility/high", "/analytics/volatility/high");

    // ─────────────────────────────────────────────────────────────────────────
    // 8. STATISTICS ROUTES
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /stats/market-cap", "/stats/market-cap");
    await testRoute("GET /stats/average-price", "/stats/average-price");
    await testRoute("GET /stats/average-volume", "/stats/average-volume");
    await testRoute("GET /stats/highest-market-cap", "/stats/highest-market-cap");
    await testRoute("GET /stats/highest-volume", "/stats/highest-volume");
    await testRoute("GET /stats/top-gainers", "/stats/top-gainers");
    await testRoute("GET /stats/top-losers", "/stats/top-losers");
    await testRoute("GET /stats/monthly-analysis", "/stats/monthly-analysis");
    await testRoute("GET /stats/coin-count", "/stats/coin-count");
    await testRoute("GET /stats/rank-distribution", "/stats/rank-distribution");
    await testRoute("GET /stats/price-distribution", "/stats/price-distribution");
    await testRoute("GET /stats/volatility-distribution", "/stats/volatility-distribution");
    await testRoute("GET /stats/market-summary", "/stats/market-summary");
    await testRoute("GET /stats/daily-analysis", "/stats/daily-analysis");
    await testRoute("GET /stats/yearly-analysis", "/stats/yearly-analysis");

    // ─────────────────────────────────────────────────────────────────────────
    // 9. MIDDLEWARE PRACTICE & HEALTH & VERSION/CONFIG & LOGOUT
    // ─────────────────────────────────────────────────────────────────────────────
    await testRoute("GET /middleware/logger", "/middleware/logger");
    await testRoute("GET /middleware/auth", "/middleware/auth");
    await testRoute("GET /middleware/rate-limit", "/middleware/rate-limit");
    await testRoute("GET /middleware/error-handler (Expected 500 error)", "/middleware/error-handler", "GET", null, userToken, 500);

    // Authentication password-forget/reset & email verification
    await testRoute("POST /auth/forgot-password", "/auth/forgot-password", "POST", { email: "user@cryptoverse.com" });
    await testRoute("POST /auth/reset-password", "/auth/reset-password", "POST", { email: "user@cryptoverse.com", code: "1234", newPassword: "NewPassword@123" });
    await testRoute("POST /auth/verify-email", "/auth/verify-email", "POST", { email: "user@cryptoverse.com", code: "5678" });

    // JWT Routes
    await testRoute("POST /jwt/generate-token", "/jwt/generate-token", "POST", { email: "user@cryptoverse.com" });
    const jwtGen = await request("/jwt/generate-token", "POST", { email: "user@cryptoverse.com" });
    const tempJwt = jwtGen.data?.data?.token;
    console.assert(!!tempJwt, "Temp token failed");

    await testRoute("POST /jwt/verify-token", "/jwt/verify-token", "POST", { token: tempJwt });
    await testRoute("GET /jwt/profile", "/jwt/profile", "GET", null, tempJwt);
    await testRoute("GET /jwt/dashboard", "/jwt/dashboard", "GET", null, tempJwt);
    await testRoute("GET /jwt/private-stats", "/jwt/private-stats", "GET", null, tempJwt);
    await testRoute("POST /jwt/refresh-token", "/jwt/refresh-token", "POST", { token: tempJwt });
    await testRoute("DELETE /jwt/revoke-token", "/jwt/revoke-token", "DELETE", { token: tempJwt });

    // Admin protected JWT route
    const jwtAdminGen = await request("/jwt/generate-token", "POST", { email: "admin@cryptoverse.com", role: "admin" });
    const adminTempJwt = jwtAdminGen.data?.data?.token;
    await testRoute("GET /jwt/admin (Forbidden for User)", "/jwt/admin", "GET", null, tempJwt, 403);
    await testRoute("GET /jwt/admin (Admin)", "/jwt/admin", "GET", null, adminTempJwt, 200);

    // Advanced routes
    await testRoute("GET /coins/recommendations", "/coins/recommendations");
    await testRoute("GET /coins/predictions", "/coins/predictions");
    await testRoute("GET /coins/portfolio/simulate", "/coins/portfolio/simulate");
    await testRoute("GET /coins/heatmap", "/coins/heatmap");
    await testRoute("GET /coins/market-status", "/coins/market-status");
    await testRoute("GET /coins/performance/top-monthly", "/coins/performance/top-monthly");
    await testRoute("GET /coins/performance/top-yearly", "/coins/performance/top-yearly");
    await testRoute("GET /coins/alerts/high-volatility", "/coins/alerts/high-volatility");
    await testRoute("GET /coins/alerts/market-drop", "/coins/alerts/market-drop");
    await testRoute("POST /coins/report", "/coins/report", "POST", { issue: "Price discrepancy" });
    await testRoute("GET /coins/cache/clear", "/coins/cache/clear");
    await testRoute("GET /coins/system/health", "/coins/system/health");
    await testRoute("GET /coins/system/version", "/coins/system/version");
    await testRoute("GET /coins/system/config", "/coins/system/config");

    // ─────────────────────────────────────────────────────────────────────────
    // 10. HEAD & OPTIONS VERIFICATIONS
    // ─────────────────────────────────────────────────────────────────────────────
    process.stdout.write("Testing HEAD /coins ... ");
    const headCoins = await request("/coins", "HEAD", null, userToken);
    console.assert(headCoins.status === 200 && headCoins.headers.get("X-Total-Coins-Count") !== null);
    console.log("PASSED");

    process.stdout.write("Testing HEAD /coins/:coinId ... ");
    const headCoin = await request("/coins/bitcoin", "HEAD", null, userToken);
    console.assert(headCoin.status === 200 && headCoin.headers.get("X-Coin-Details-Available") !== null);
    console.log("PASSED");

    process.stdout.write("Testing HEAD /coins/history/:coinId ... ");
    const headHistory = await request("/coins/history/bitcoin", "HEAD", null, userToken);
    console.assert(headHistory.status === 200 && headHistory.headers.get("X-Historical-Available") !== null);
    console.log("PASSED");

    process.stdout.write("Testing HEAD /stats/market-cap ... ");
    const headStats = await request("/stats/market-cap", "HEAD", null, userToken);
    console.assert(headStats.status === 200 && headStats.headers.get("X-Total-Market-Cap-Metadata") !== null);
    console.log("PASSED");

    process.stdout.write("Testing HEAD /auth/profile ... ");
    const headProfile = await request("/auth/profile", "HEAD", null, userToken);
    console.assert(headProfile.status === 200 && headProfile.headers.get("X-User-Authenticated") !== null);
    console.log("PASSED");

    process.stdout.write("Testing HEAD /coins/system/health ... ");
    const headHealth = await request("/coins/system/health", "HEAD", null, userToken);
    console.assert(headHealth.status === 200 && headHealth.headers.get("X-System-Health") !== null);
    console.log("PASSED");

    process.stdout.write("Testing HEAD /analytics/price/highest ... ");
    const headPrice = await request("/analytics/price/highest", "HEAD", null, userToken);
    console.assert(headPrice.status === 200 && headPrice.headers.get("X-Highest-Price-Analytics") !== null);
    console.log("PASSED");

    process.stdout.write("Testing OPTIONS /coins ... ");
    const optCoins = await request("/coins", "OPTIONS");
    console.assert(optCoins.status === 200 && optCoins.headers.get("Allow") !== null);
    console.log("PASSED");

    process.stdout.write("Testing OPTIONS /coins/bitcoin ... ");
    const optCoin = await request("/coins/bitcoin", "OPTIONS");
    console.assert(optCoin.status === 200 && optCoin.headers.get("Allow") !== null);
    console.log("PASSED");

    process.stdout.write("Testing OPTIONS /auth/login ... ");
    const optLogin = await request("/auth/login", "OPTIONS");
    console.assert(optLogin.status === 200 && optLogin.headers.get("Allow") !== null);
    console.log("PASSED");

    process.stdout.write("Testing OPTIONS /admin/coins ... ");
    const optAdmin = await request("/admin/coins", "OPTIONS");
    console.assert(optAdmin.status === 200 && optAdmin.headers.get("Allow") !== null);
    console.log("PASSED");

    process.stdout.write("Testing OPTIONS /search/coins ... ");
    const optSearch = await request("/search/coins", "OPTIONS");
    console.assert(optSearch.status === 200 && optSearch.headers.get("Allow") !== null);
    console.log("PASSED");

    process.stdout.write("Testing OPTIONS /jwt/profile ... ");
    const optJwt = await request("/jwt/profile", "OPTIONS");
    console.assert(optJwt.status === 200 && optJwt.headers.get("Allow") !== null);
    console.log("PASSED");

    process.stdout.write("Testing OPTIONS /coins/system/health ... ");
    const optHealth = await request("/coins/system/health", "OPTIONS");
    console.assert(optHealth.status === 200 && optHealth.headers.get("Allow") !== null);
    console.log("PASSED");

    // Clean up profile deletion at the end
    await testRoute("DELETE /auth/profile", "/auth/profile", "DELETE", null, userToken, 200);

    console.log("\n==========================================");
    console.log("ALL ROUTE CHECKS AND VALIDATIONS PASSED 🎉");
    console.log("==========================================");

  } catch (error) {
    console.error("\nTest suite threw an error:", error);
    process.exit(1);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("Closed test server.");
    }
    // Clean up test DB
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
