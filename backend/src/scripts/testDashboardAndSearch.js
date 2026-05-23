import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";
import Coin from "../models/Coin.js";
import Bookmark from "../models/Bookmark.js";
import Portfolio from "../models/Portfolio.js";
import SearchLog from "../models/SearchLog.js";
import * as searchService from "../services/search.service.js";
import * as portfolioService from "../services/portfolio.service.js";

const TEST_MONGO_URI = "mongodb://localhost:27017/cryptoverse_test";

async function runTests() {
  console.log("==========================================");
  console.log("TESTING DASHBOARD AND SEARCH MODULES");
  console.log("==========================================");

  try {
    await mongoose.connect(TEST_MONGO_URI);
    console.log("Connected to test database.");

    // Clear existing test data
    await User.deleteMany({});
    await Coin.deleteMany({});
    await Bookmark.deleteMany({});
    await Portfolio.deleteMany({});
    await SearchLog.deleteMany({});
    console.log("Cleared test database.");

    // 1. Seed mock Coin
    const btc = await Coin.create({
      coinId: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      rank: 1,
      price: 60000,
      marketCap: 1200000000000,
      volume: 20000000000,
      dailyReturn: 1.5,
      volatility: 1.1,
      month: "May",
      year: 2026,
    });

    const eth = await Coin.create({
      coinId: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      rank: 2,
      price: 3000,
      marketCap: 360000000000,
      volume: 10000000000,
      dailyReturn: 2.8,
      volatility: 1.5,
      month: "May",
      year: 2026,
    });

    console.log("Seeded mock Coins.");

    // 2. Create mock User
    const user = await User.create({
      name: "Dashboard User",
      email: "dash@test.com",
      password: "password123",
      role: "user",
    });
    console.log("Seeded mock User.");

    // ----------------------------------------------------
    // SEARCH TESTS
    // ----------------------------------------------------
    console.log("\n--- SEARCH SYSTEM TESTS ---");

    // Perform query and log
    console.log("Searching for 'bit'...");
    const searchRes = await searchService.executeSearchAndLog(user._id, { q: "bit" });
    console.log(`Search matched ${searchRes.coins.length} coins.`);
    console.assert(searchRes.coins.length > 0, "Should match at least 1 coin");

    // Test consecutive duplicate suppression
    console.log("Searching for 'bit' again (should not create a second duplicate log)...");
    await searchService.executeSearchAndLog(user._id, { q: "bit" });

    // Search for different query
    console.log("Searching for 'eth'...");
    await searchService.executeSearchAndLog(user._id, { q: "eth" });

    // Fetch recent searches
    const recents = await searchService.getRecentSearches(user._id);
    console.log("Recent Searches:", recents);
    console.assert(recents.length === 2, "Should have exactly 2 unique search logs");
    console.assert(recents[0].query === "eth", "Most recent search should be 'eth'");
    console.assert(recents[1].query === "bit", "Second most recent search should be 'bit'");

    // Fetch trending searches globally
    const trending = await searchService.getTrendingSearches(5);
    console.log("Global Trending Searches:", trending);
    console.assert(trending.length === 2, "Should have 2 trending terms");

    // ----------------------------------------------------
    // PORTFOLIO AND BOOKMARK ACTIVITIES (DASHBOARD PREPARATION)
    // ----------------------------------------------------
    console.log("\n--- SEEDING USER ACTIONS FOR DASHBOARD ---");

    // User bookmarks BTC
    await Bookmark.create({
      user: user._id,
      coin: btc._id,
      coinName: btc.name,
      symbol: btc.symbol,
      addedPrice: btc.price,
      currentPrice: btc.price,
      category: "core",
      notes: "HODL forever",
    });
    console.log("User bookmarked Bitcoin.");

    // User adds buy transaction to portfolio
    await Portfolio.create({
      user: user._id,
      coin: btc._id,
      coinName: btc.name,
      symbol: btc.symbol,
      quantity: 0.5,
      buyPrice: 50000,
      currentPrice: btc.price, // Live price is 60000
    });
    console.log("User added 0.5 BTC transaction to portfolio at 50,000.");

    // ----------------------------------------------------
    // DASHBOARD OVERVIEW TESTS
    // ----------------------------------------------------
    console.log("\n--- DASHBOARD OVERVIEW TESTS ---");
    const dashboard = await portfolioService.getDashboardOverview(user._id);
    console.log("Dashboard Overview Data:", JSON.stringify(dashboard, null, 2));

    // Assert portfolio totals calculations
    console.assert(dashboard.totals.totalInvested === 25000, "Total invested should be 25,000 (0.5 * 50k)");
    console.assert(dashboard.totals.totalCurrentValue === 30000, "Total current value should be 30,000 (0.5 * 60k)");
    console.assert(dashboard.totals.totalProfitLoss === 5000, "Total profit/loss should be +5,000");
    console.assert(dashboard.totals.profitLossPercentage === 20, "Total profit/loss percentage should be +20%");

    // Assert chronological recent activity compiled feed
    console.log(" Chronological Activities Compiled Feed length:", dashboard.recentActivity.length);
    console.assert(dashboard.recentActivity.length >= 3, "Activity feed should combine searches, bookmarks, and transactions");

    // Assert sorting order (newest first)
    const t0 = new Date(dashboard.recentActivity[0].timestamp);
    const t1 = new Date(dashboard.recentActivity[1].timestamp);
    console.assert(t0 >= t1, "Recent activities must be in reverse chronological order (newest first)");
    console.log("Chronological order check passed.");

    // ----------------------------------------------------
    // CLEAN HISTORY TEST
    // ----------------------------------------------------
    console.log("\n--- CLEAR SEARCH HISTORY TEST ---");
    await searchService.clearRecentSearches(user._id);
    const recentsAfterClear = await searchService.getRecentSearches(user._id);
    console.log("Recent Searches after clear:", recentsAfterClear);
    console.assert(recentsAfterClear.length === 0, "Recent searches should be completely empty");

    console.log("\n==========================================");
    console.log("ALL DASHBOARD AND SEARCH INTEGRATION TESTS PASSED 🎉");
    console.log("==========================================");

  } catch (error) {
    console.error("Test suite threw an error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

runTests();
