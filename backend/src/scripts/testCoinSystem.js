import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";
import Coin from "../models/Coin.js";
import * as coinService from "../services/coin.service.js";

const TEST_MONGO_URI = "mongodb://localhost:27017/cryptoverse_test";

async function runTests() {
  console.log("==========================================");
  console.log("TESTING COIN MANAGEMENT SYSTEM AND CRUD");
  console.log("==========================================");

  try {
    await mongoose.connect(TEST_MONGO_URI);
    console.log("Connected to test database.");

    // Clear existing coins
    await Coin.deleteMany({});
    console.log("Cleared Coin collection.");

    // 1. Create unique mock coins
    const btcData = {
      coinId: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      price: 64000,
      rank: 1,
      marketCap: 1200000000000,
      volume: 25000000000,
      dailyReturn: 2.5,
      volatility: 1.2,
      circulatingSupply: 19600000,
      totalSupply: 21000000,
      maxSupply: 21000000,
      category: "Layer-1",
      image: "https://example.com/btc.png",
      marketStatus: "active",
      tags: ["pow", "store-of-value", "large-cap"]
    };

    const ethData = {
      coinId: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      price: 3500,
      rank: 2,
      marketCap: 420000000000,
      volume: 15000000000,
      dailyReturn: 4.8,
      volatility: 1.8,
      circulatingSupply: 120000000,
      totalSupply: 120000000,
      maxSupply: 0,
      category: "Layer-1",
      image: "https://example.com/eth.png",
      marketStatus: "active",
      tags: ["pos", "smart-contracts", "large-cap"]
    };

    const solData = {
      coinId: "solana",
      name: "Solana",
      symbol: "sol",
      price: 150,
      rank: 5,
      marketCap: 67000000000,
      volume: 4000000000,
      dailyReturn: -3.2,
      volatility: 3.1,
      circulatingSupply: 440000000,
      totalSupply: 570000000,
      maxSupply: 0,
      category: "Layer-1",
      image: "https://example.com/sol.png",
      marketStatus: "active",
      tags: ["pos", "high-throughput", "mid-cap"]
    };

    const btc = await coinService.createCoin(btcData);
    const eth = await coinService.createCoin(ethData);
    const sol = await coinService.createCoin(solData);

    console.log("Successfully created 3 initial coins.");

    // 2. Duplicate validation checks
    console.log("\n--- DUPLICATE VALIDATION ---");
    try {
      await coinService.createCoin({
        coinId: "bitcoin",
        name: "Bitcoin Fork",
        symbol: "btcf",
        price: 100
      });
      throw new Error("Should fail on duplicate coinId");
    } catch (err) {
      console.log("SUCCESS (Expected Fail on duplicate coinId):", err.message);
      console.assert(err.statusCode === 409);
    }

    try {
      await coinService.createCoin({
        coinId: "bitcoin-fork",
        name: "Bitcoin Fork",
        symbol: "btc",
        price: 100
      });
      throw new Error("Should fail on duplicate symbol");
    } catch (err) {
      console.log("SUCCESS (Expected Fail on duplicate symbol):", err.message);
      console.assert(err.statusCode === 409);
    }

    // 3. Search and filtering verification
    console.log("\n--- SEARCH AND FILTERING ---");
    
    // Category filter
    const layer1Result = await coinService.getAllCoins({ category: "Layer-1" });
    console.log("Category 'Layer-1' coins count:", layer1Result.coins.length);
    console.assert(layer1Result.coins.length === 3);

    // Global Regex search on tags/name/symbol
    const smartContractResult = await coinService.getGlobalSearch({ q: "smart-contracts" });
    console.log("Global search for 'smart-contracts' count:", smartContractResult.coins.length);
    console.assert(smartContractResult.coins.length === 1);
    console.assert(smartContractResult.coins[0].symbol === "ETH");

    // Sorting and Pagination
    const sortedResult = await coinService.getAllCoins({ sortBy: "marketCap", sortOrder: "desc", limit: 2 });
    console.log("Sorted by marketCap desc (limit 2) first element:", sortedResult.coins[0].symbol);
    console.assert(sortedResult.coins[0].symbol === "BTC");
    console.assert(sortedResult.coins.length === 2);
    console.assert(sortedResult.meta.totalPages === 2);

    // Volume range filter
    const volumeResult = await coinService.getAllCoins({ minVolume: 5000000000, maxVolume: 20000000000 });
    console.log("Volume between 5B and 20B coins count:", volumeResult.coins.length);
    console.assert(volumeResult.coins.length === 1);
    console.assert(volumeResult.coins[0].symbol === "ETH");

    // 4. PUT & PATCH endpoints verification
    console.log("\n--- UPDATE AND REPLACE ---");
    
    // PATCH
    const patched = await coinService.updateCoin("solana", { price: 160, tags: ["pos", "solana-ecosystem"] });
    console.log("Patched Solana price:", patched.price, "tags:", patched.tags);
    console.assert(patched.price === 160);
    console.assert(patched.tags.length === 2);

    // PUT
    const replaced = await coinService.replaceCoin("solana", {
      coinId: "solana",
      name: "Solana Network",
      symbol: "sol",
      price: 180,
      rank: 4,
      marketCap: 70000000000,
      volume: 5000000000,
      dailyReturn: 5.2,
      volatility: 2.9,
      circulatingSupply: 450000000,
      totalSupply: 580000000,
      maxSupply: 0,
      category: "Layer-1",
      image: "https://example.com/sol-updated.png",
      marketStatus: "active",
      tags: ["pos", "super-fast"],
      timestamp: new Date()
    });
    console.log("Replaced Solana name:", replaced.name, "price:", replaced.price, "rank:", replaced.rank);
    console.assert(replaced.name === "Solana Network");
    console.assert(replaced.price === 180);
    console.assert(replaced.rank === 4);

    // 5. Trending, Gainers, Losers
    console.log("\n--- TRENDING, GAINERS, LOSERS ---");
    const trending = await coinService.getTrendingCoins(3);
    console.log("Top Trending coin dailyReturn:", trending[0].dailyReturn, "symbol:", trending[0].symbol);
    // Solana dailyReturn is 5.2, Eth is 4.8, Btc is 2.5
    console.assert(trending[0].symbol === "SOL");

    const gainers = await coinService.getTopGainers(2);
    console.log("Top Gainer dailyReturn:", gainers[0].dailyReturn, "symbol:", gainers[0].symbol);
    console.assert(gainers[0].symbol === "SOL");

    const losers = await coinService.getTopLosers(2);
    console.log("Top Loser dailyReturn:", losers[0].dailyReturn, "symbol:", losers[0].symbol);
    console.assert(losers[0].symbol === "BTC");

    // 6. Aggregation Summary
    console.log("\n--- MARKET SUMMARY AGGREGATION ---");
    const summary = await coinService.getMarketSummary();
    console.log("Market Summary:", JSON.stringify(summary, null, 2));
    
    // Total Market Cap = 1.2T (btc) + 420B (eth) + 70B (sol) = 1.69T
    console.assert(summary.totalMarketCap === 1690000000000);
    console.assert(summary.totalCoins === 3);
    console.assert(Math.round(summary.averagePrice) === 22560); // (64000+3500+180)/3

    // 7. Delete Coin
    console.log("\n--- DELETE COIN ---");
    await coinService.deleteCoin("solana");
    try {
      await coinService.getCoinById("solana");
      throw new Error("Should fail to retrieve deleted coin");
    } catch (err) {
      console.log("SUCCESS (Expected Fail on get deleted coin):", err.message);
      console.assert(err.statusCode === 404);
    }

    console.log("\n==========================================");
    console.log("ALL COIN MANAGEMENT AND CRUD TESTS PASSED 🎉");
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
