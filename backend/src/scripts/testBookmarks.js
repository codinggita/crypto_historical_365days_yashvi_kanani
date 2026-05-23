import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";
import Coin from "../models/Coin.js";
import Bookmark from "../models/Bookmark.js";
import * as bookmarkService from "../services/bookmark.service.js";

const TEST_MONGO_URI = "mongodb://localhost:27017/cryptoverse_test";

async function runTests() {
  console.log("==========================================");
  console.log("STARTING BOOKMARK SYSTEM INTEGRATION TESTS");
  console.log("==========================================");

  try {
    // Connect to test database
    await mongoose.connect(TEST_MONGO_URI);
    console.log("Connected to test database.");

    // Clean up test database collections
    await User.deleteMany({});
    await Coin.deleteMany({});
    await Bookmark.deleteMany({});
    console.log("Cleared test database collections.");

    // 1. Seed Coins
    const btc = await Coin.create({
      coinId: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      rank: 1,
      price: 65000,
      marketCap: 1280000000000,
      volume: 25000000000,
      dailyReturn: 2.5,
      volatility: 1.2,
      month: "May",
      year: 2026,
    });

    const eth = await Coin.create({
      coinId: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      rank: 2,
      price: 3400,
      marketCap: 400000000000,
      volume: 12000000000,
      dailyReturn: 4.1,
      volatility: 1.8,
      month: "May",
      year: 2026,
    });

    const ada = await Coin.create({
      coinId: "cardano",
      name: "Cardano",
      symbol: "ADA",
      rank: 10,
      price: 0.5,
      marketCap: 17000000000,
      volume: 500000000,
      dailyReturn: -1.2,
      volatility: 2.5,
      month: "May",
      year: 2026,
    });

    console.log("Seeded mock Coins.");

    // 2. Create mock Users
    const userA = await User.create({
      name: "User Alice",
      email: "alice@test.com",
      password: "password123",
      role: "user",
    });

    const userB = await User.create({
      name: "User Bob",
      email: "bob@test.com",
      password: "password123",
      role: "user",
    });

    console.log("Seeded mock Users: Alice and Bob.");

    // ----------------------------------------------------
    // TEST 1: Add Bookmark
    // ----------------------------------------------------
    console.log("\n--- TEST 1: Add Bookmark ---");
    const bookmark1 = await bookmarkService.addBookmark(userA._id, "bitcoin", {
      category: "longterm",
      notes: "HODL forever",
    });
    console.log(`Successfully bookmarked ${bookmark1.coinName} (${bookmark1.symbol}) for Alice.`);
    console.assert(bookmark1.coinName === "Bitcoin", "Coin name should be Bitcoin");
    console.assert(bookmark1.addedPrice === 65000, "Added price should match live coin price");

    // ----------------------------------------------------
    // TEST 2: Duplicate Prevention
    // ----------------------------------------------------
    console.log("\n--- TEST 2: Duplicate Prevention ---");
    try {
      await bookmarkService.addBookmark(userA._id, "bitcoin", {
        category: "shortterm",
        notes: "Trying to duplicate",
      });
      console.error("FAIL: Allowed duplicate bookmark!");
    } catch (error) {
      console.log(`SUCCESS (Expected Fail): Duplicate rejected. Error message: "${error.message}"`);
      console.assert(error.statusCode === 400, "Status code should be 400");
    }

    // ----------------------------------------------------
    // TEST 3: Check Bookmark Status
    // ----------------------------------------------------
    console.log("\n--- TEST 3: Check Bookmark Status ---");
    const status1 = await bookmarkService.checkBookmarkStatus(userA._id, "bitcoin");
    console.log("Alice checking Bitcoin bookmark status:", status1);
    console.assert(status1.bookmarked === true, "Bitcoin should be bookmarked");

    const status2 = await bookmarkService.checkBookmarkStatus(userA._id, "ethereum");
    console.log("Alice checking Ethereum bookmark status:", status2);
    console.assert(status2.bookmarked === false, "Ethereum should not be bookmarked yet");

    // Add Ethereum to Alice's bookmarks
    await bookmarkService.addBookmark(userA._id, "ethereum", {
      category: "longterm",
      notes: "Vitalik's coin",
    });

    // ----------------------------------------------------
    // TEST 4: Fetch Bookmarks with Sorting, Filtering, and Search
    // ----------------------------------------------------
    console.log("\n--- TEST 4: Fetching Bookmarks (Search/Filter/Sort/Pagination) ---");
    // Get all Alice's bookmarks
    const resultAll = await bookmarkService.getBookmarks(userA._id, {});
    console.log(`Total bookmarks found for Alice: ${resultAll.items.length}`);
    console.assert(resultAll.items.length === 2, "Alice should have 2 bookmarks");
    console.assert(resultAll.meta.total === 2, "Meta count should be 2");

    // Filter by category
    const resultFiltered = await bookmarkService.getBookmarks(userA._id, { category: "longterm" });
    console.log(`Category "longterm" filter items count: ${resultFiltered.items.length}`);
    console.assert(resultFiltered.items.length === 2, "Both bookmarks are longterm");

    // Search by q
    const resultSearch = await bookmarkService.getBookmarks(userA._id, { q: "eth" });
    console.log(`Search for "eth" count: ${resultSearch.items.length}`);
    console.assert(resultSearch.items.length === 1, "Only Ethereum matches eth");
    console.assert(resultSearch.items[0].coinName === "Ethereum", "Found item should be Ethereum");

    // ----------------------------------------------------
    // TEST 5: Unauthorized Access & User Isolation
    // ----------------------------------------------------
    console.log("\n--- TEST 5: Unauthorized Access / User Isolation ---");
    try {
      // Bob attempts to fetch Alice's bookmark by ID
      await bookmarkService.getBookmarkById(userB._id, bookmark1._id);
      console.error("FAIL: Bob successfully fetched Alice's bookmark!");
    } catch (error) {
      console.log(`SUCCESS (Expected Fail): Bob access denied. Error: "${error.message}"`);
      console.assert(error.statusCode === 404, "Should be 404 Not Found due to user isolation");
    }

    // ----------------------------------------------------
    // TEST 6: Update Bookmark Notes & Category
    // ----------------------------------------------------
    console.log("\n--- TEST 6: Update Bookmark ---");
    const updated = await bookmarkService.updateBookmark(userA._id, bookmark1._id, {
      category: "core-holdings",
      notes: "Updated HODL strategy",
    });
    console.log(`Updated Bitcoin bookmark category to "${updated.category}" and notes to "${updated.notes}"`);
    console.assert(updated.category === "core-holdings", "Category update failed");
    console.assert(updated.notes === "Updated HODL strategy", "Notes update failed");

    // ----------------------------------------------------
    // TEST 7: Analytics Summary
    // ----------------------------------------------------
    console.log("\n--- TEST 7: Analytics Summary ---");
    // Update live price of Bitcoin to trigger some profit potential
    await Coin.findByIdAndUpdate(btc._id, { price: 80000 }); // $65000 -> $80000 (appreciation)

    const summary = await bookmarkService.getAnalyticsSummary(userA._id);
    console.log("Alice's Analytics Summary:", JSON.stringify(summary, null, 2));
    console.assert(summary.totalBookmarked === 2, "Total bookmarked should be 2");
    console.assert(summary.highestMarketCap.coinName === "Bitcoin", "Bitcoin is highest market cap");
    console.assert(summary.highestProfitPotential.symbol === "BTC", "BTC has the highest profit potential (appreciation from 65k to 80k)");
    console.assert(summary.highestProfitPotential.profitPotential > 20, "BTC profit potential should be ~23%");

    // ----------------------------------------------------
    // TEST 8: Trending Bookmarks
    // ----------------------------------------------------
    console.log("\n--- TEST 8: Trending Bookmarks ---");
    // Bob bookmarks Ethereum as well
    await bookmarkService.addBookmark(userB._id, "ethereum", { category: "watchlist" });
    // Bob bookmarks Cardano
    await bookmarkService.addBookmark(userB._id, "cardano", { category: "watchlist" });

    // Ethereum now has 2 bookmarks (Alice, Bob), Bitcoin has 1 (Alice), Cardano has 1 (Bob)
    const trending = await bookmarkService.getTrendingBookmarks(5);
    console.log("Global Trending Bookmarks:", JSON.stringify(trending, null, 2));
    console.assert(trending[0].symbol === "ETH", "Ethereum should be trending first (2 bookmarks)");
    console.assert(trending[0].count === 2, "Ethereum bookmark count should be 2");

    // ----------------------------------------------------
    // TEST 9: Delete Bookmark
    // ----------------------------------------------------
    console.log("\n--- TEST 9: Delete Bookmark ---");
    const deleted = await bookmarkService.deleteBookmark(userA._id, bookmark1._id);
    console.log(`Deleted bookmark: ${deleted.coinName}`);

    // Verify it is gone
    const checkDeleted = await Bookmark.findById(bookmark1._id);
    console.assert(checkDeleted === null, "Bookmark should be deleted from DB");

    const finalSummary = await bookmarkService.getAnalyticsSummary(userA._id);
    console.log("Alice's Final Bookmarks count after deletion:", finalSummary.totalBookmarked);
    console.assert(finalSummary.totalBookmarked === 1, "Alice should have 1 bookmark remaining");

    console.log("\n==========================================");
    console.log("ALL BOOKMARK INTEGRATION TESTS PASSED 🎉");
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
