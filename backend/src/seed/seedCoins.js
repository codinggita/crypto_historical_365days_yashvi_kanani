import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Coin from "../models/Coin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Image mapping for popular coins
const IMAGE_MAP = {
  bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  binancecoin: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  solana: "https://cryptologos.cc/logos/solana-sol-logo.png",
  ripple: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
  dogecoin: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  cardano: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  avalanche: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  "avalanche-2": "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  polkadot: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  chainlink: "https://cryptologos.cc/logos/chainlink-link-logo.png",
  shiba_inu: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
  "shiba-inu": "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
  litecoin: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
  uniswap: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  pepe: "https://cryptologos.cc/logos/pepe-pepe-logo.png",
  vechain: "https://cryptologos.cc/logos/vechain-vet-logo.png",
  stellar: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
  sui: "https://cryptologos.cc/logos/sui-sui-logo.png",
  monero: "https://cryptologos.cc/logos/monero-xmr-logo.png",
  cosmos: "https://cryptologos.cc/logos/cosmos-atom-logo.png",
  tether: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  "usd-coin": "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
};

// Category mapping helper
function getCategory(coinId) {
  const lId = coinId.toLowerCase();
  
  if (lId.includes("tether") || lId.includes("usd") || lId.includes("dai") || lId === "paypal-usd" || lId === "ripple-usd" || lId === "ethena-usde" || lId === "susds") {
    return "Stablecoin";
  }
  if (lId === "bitcoin" || lId === "ethereum" || lId === "solana" || lId.includes("avalanche") || lId === "cardano" || lId === "polkadot" || lId === "sui" || lId === "aptos" || lId === "near" || lId === "algorand" || lId === "stellar" || lId === "vechain" || lId.includes("classic")) {
    return "Layer-1";
  }
  if (lId === "aave" || lId === "uniswap" || lId.includes("ondo") || lId.includes("jupiter") || lId.includes("kelp") || lId.includes("staked")) {
    return "DeFi";
  }
  if (lId === "dogecoin" || lId === "shiba-inu" || lId === "pepe" || lId.includes("pump-fun")) {
    return "Meme";
  }
  if (lId === "binancecoin" || lId.includes("kucoin") || lId.includes("gate") || lId.includes("okb") || lId.includes("bitget")) {
    return "Exchange";
  }
  if (lId === "chainlink") {
    return "Oracle";
  }
  return "Other";
}

// Tag generation helper
function getTags(category, coinId) {
  const tags = ["imported"];
  const lId = coinId.toLowerCase();
  
  if (category === "Stablecoin") {
    tags.push("stablecoin", "fiat-pegged");
  } else if (category === "Layer-1") {
    tags.push("layer-1", "smart-contracts");
    if (lId === "bitcoin") {
      tags.push("pow", "store-of-value");
    } else {
      tags.push("pos");
    }
  } else if (category === "DeFi") {
    tags.push("defi", "yield", "lending");
  } else if (category === "Meme") {
    tags.push("meme", "community");
  } else if (category === "Exchange") {
    tags.push("exchange", "utility-token");
  } else if (category === "Oracle") {
    tags.push("oracle", "data-feed");
  }
  
  if (lId.includes("wrapped") || lId.includes("staked") || lId.includes("peg")) {
    tags.push("wrapped-token");
  }
  
  return tags;
}

// ── Helpers for history generation ─────────────────────────────────────────────
const rnd  = (min, max) => Math.random() * (max - min) + min;
const snap = (n, d = 6)  => Math.round(n * 10 ** d) / 10 ** d;

/**
 * Generate 365 daily snapshots for one coin starting from 365 days ago.
 */
function generateHistory(coin) {
  const records = [];
  const now = new Date();
  let price = coin.basePrice;

  for (let day = 364; day >= 0; day--) {
    const dailyReturn = snap(rnd(-6, 6));
    price = snap(price * (1 + dailyReturn / 100), 6);
    if (price <= 0) price = coin.basePrice * 0.1;

    const volume    = snap(coin.volume    * rnd(0.5, 1.8));
    const marketCap = snap(price * coin.circ);
    const volatility= snap(coin.volatility * rnd(0.6, 1.4), 4);

    const ts = new Date(now);
    ts.setDate(ts.getDate() - day);
    ts.setHours(0, 0, 0, 0);

    records.push({
      coinId:           coin.coinId,
      name:             coin.name,
      symbol:           coin.symbol,
      rank:             coin.rank,
      price,
      marketCap,
      volume,
      dailyReturn,
      volatility,
      circulatingSupply: coin.circ,
      totalSupply:       coin.total,
      maxSupply:         coin.total,
      category:          coin.category,
      image:             coin.image,
      marketStatus:      "active",
      tags:              coin.tags,
      timestamp:         ts,
    });
  }

  return records;
}

function findLargestDatasetFile() {
  const searchDirs = [
    path.join(os.homedir(), "Downloads"),
    process.cwd(),
    path.join(process.cwd(), ".."),
    path.join(process.cwd(), "backend"),
    path.join(process.cwd(), "..", "..")
  ];
  
  const matches = [];
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.toLowerCase().endsWith(".json")) {
          // Exclude configuration files
          const lowerFile = file.toLowerCase();
          if (lowerFile.includes("package") || lowerFile.includes("tsconfig") || lowerFile.includes("jsconfig") || lowerFile.includes("eslint") || lowerFile.includes("vercel")) {
            continue;
          }
          
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile() && stat.size > 1000) {
            matches.push({ path: fullPath, size: stat.size });
          }
        }
      }
    } catch (e) {
      // Ignore directory read errors
    }
  }
  
  if (matches.length === 0) return null;
  
  // Sort by size descending
  matches.sort((a, b) => b.size - a.size);
  
  // Verify which is the largest valid JSON array containing coin schema elements
  for (const match of matches) {
    try {
      const data = JSON.parse(fs.readFileSync(match.path, "utf-8"));
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if ((first.coin_id || first.coinId) && (first.coin_name || first.name) && first.symbol) {
          return match.path;
        }
      }
    } catch (e) {
      // Skip if parsing or schema checks fail
    }
  }
  
  return null;
}

function getInvalidReason(item) {
  const coinId = item.coin_id || item.coinId;
  const name = item.coin_name || item.name;
  const symbol = item.symbol;
  const price = item.price;
  const timestamp = item.timestamp || item.date;

  if (!coinId) return "Missing 'coin_id' or 'coinId'";
  if (!name) return "Missing 'coin_name' or 'name'";
  if (!symbol) return "Missing 'symbol'";
  if (price === undefined || price === null || price === "") return "Missing 'price'";
  if (isNaN(Number(price))) return `Invalid price value: "${price}"`;
  if (!timestamp) return "Missing 'timestamp' or 'date'";
  if (isNaN(new Date(timestamp).getTime())) return `Invalid timestamp/date value: "${timestamp}"`;

  return null;
}

// ── Main ───────────────────────────────────────────────────────────────────────
const seedDB = async () => {
  let duplicatesSkipped = 0;
  let invalidRecordsSkipped = 0;
  let historicalRecordsImported = 0;
  let historicalRecordsGenerated = 0;
  
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGO_URI environment variable is missing.");

    const datasetFile = findLargestDatasetFile();
    if (!datasetFile) {
      throw new Error("Could not locate a valid crypto_historical_365days.json dataset on the system.");
    }

    const rawData = fs.readFileSync(datasetFile, "utf-8");
    const dataset = JSON.parse(rawData);

    // Group records by coin_id
    const coinGroups = {};
    for (const item of dataset) {
      const reason = getInvalidReason(item);
      if (reason) {
        invalidRecordsSkipped++;
        console.log(`[INVALID RECORD SKIPPED] Reason: ${reason} | Record: ${JSON.stringify(item).substring(0, 150)}...`);
        continue;
      }

      const coinId = (item.coin_id || item.coinId).toLowerCase();
      if (!coinGroups[coinId]) {
        coinGroups[coinId] = [];
      }
      coinGroups[coinId].push(item);
    }

    const uniqueCoinsFound = Object.keys(coinGroups).length;

    await mongoose.connect(mongoUri);
    console.log("Database Connected\n");
    console.log("Dataset Loaded Successfully\n");

    await Coin.deleteMany({});
    try {
      await mongoose.connection.db.collection("coins").dropIndexes();
    } catch (e) {
      // Ignore index drop warning
    }

    const allRecords = [];
    const processedKeys = new Set();

    for (const coinId of Object.keys(coinGroups)) {
      const group = coinGroups[coinId];

      if (group.length > 1) {
        // Direct import of historical records from dataset
        for (const item of group) {
          const rawTimestamp = item.timestamp || item.date;
          const ts = new Date(rawTimestamp);
          
          if (isNaN(ts.getTime())) {
            invalidRecordsSkipped++;
            console.log(`[INVALID RECORD SKIPPED] Reason: Invalid date format "${rawTimestamp}" | Record: ${JSON.stringify(item).substring(0, 150)}...`);
            continue;
          }

          // Duplicate verification (same coin and date)
          const duplicateKey = `${coinId}_${ts.getTime()}`;
          if (processedKeys.has(duplicateKey)) {
            duplicatesSkipped++;
            continue;
          }
          processedKeys.add(duplicateKey);

          const price = Number(item.price);
          const marketCap = Number(item.market_cap || item.marketCap) || 0;
          const volume = Number(item.volume) || 0;
          const dailyReturn = item.daily_return ? Number(item.daily_return) : 0;
          const volatility = item.volatility_7d ? Number(item.volatility_7d) : 0;
          const circulatingSupply = price > 0 ? (marketCap / price) : 0;

          const category = getCategory(coinId);
          const image = IMAGE_MAP[coinId] || "";
          const tags = getTags(category, coinId);

          allRecords.push({
            coinId,
            name: item.coin_name || item.name,
            symbol: item.symbol,
            rank: item.market_cap_rank ? Number(item.market_cap_rank) : 1,
            price,
            marketCap,
            volume,
            dailyReturn,
            volatility,
            circulatingSupply,
            totalSupply: circulatingSupply,
            maxSupply: 0,
            category,
            image,
            marketStatus: "active",
            tags,
            timestamp: ts,
          });
          historicalRecordsImported++;
        }
      } else {
        // Generate history from a single base record snapshot
        const baseRecord = group[0];
        const price = Number(baseRecord.price);
        const marketCap = Number(baseRecord.market_cap || baseRecord.marketCap) || 0;
        const volume = Number(baseRecord.volume) || 0;
        const volatility = Number(baseRecord.volatility_7d || baseRecord.volatility) || 1.5;
        const circ = price > 0 ? (marketCap / price) : 0;
        const category = getCategory(coinId);
        const image = IMAGE_MAP[coinId] || "";
        const tags = getTags(category, coinId);

        const coinObj = {
          coinId,
          name: baseRecord.coin_name || baseRecord.name,
          symbol: baseRecord.symbol,
          rank: baseRecord.market_cap_rank ? Number(baseRecord.market_cap_rank) : 1,
          basePrice: price,
          marketCap,
          volume,
          volatility,
          circ,
          total: circ,
          category,
          image,
          tags,
        };

        const generated = generateHistory(coinObj);
        for (const item of generated) {
          const duplicateKey = `${coinId}_${item.timestamp.getTime()}`;
          if (processedKeys.has(duplicateKey)) {
            duplicatesSkipped++;
            continue;
          }
          processedKeys.add(duplicateKey);
          allRecords.push(item);
          historicalRecordsGenerated++;
        }
      }
    }

    // Insert records in batches of 1000
    const BATCH = 1000;
    for (let i = 0; i < allRecords.length; i += BATCH) {
      await Coin.insertMany(allRecords.slice(i, i + BATCH), { ordered: false });
    }

    const count = await Coin.countDocuments();
    await Coin.createIndexes();

    console.log("\n==================================================");
    console.log("SEED REPORT");
    console.log("==================================================");
    console.log(`Dataset Path: ${datasetFile}`);
    console.log(`Dataset Records: ${dataset.length}`);
    console.log(`Unique Coins Found: ${uniqueCoinsFound}`);
    console.log(`Historical Records Imported: ${historicalRecordsImported}`);
    console.log(`Historical Records Generated: ${historicalRecordsGenerated}`);
    console.log(`Duplicates Skipped: ${duplicatesSkipped}`);
    console.log(`Invalid Records Skipped: ${invalidRecordsSkipped}`);
    console.log(`Total MongoDB Documents: ${count}`);
    console.log("==================================================\n");

    // Expected vs Actual counts comparison
    const expectedDocs = allRecords.length;
    console.log("Document Verification:");
    console.log(`Expected Documents to Insert: ${expectedDocs}`);
    console.log(`Actual Documents in Database: ${count}`);
    if (expectedDocs === count) {
      console.log("✅ Expected and actual document counts match perfectly.\n");
    } else {
      console.log("❌ Document counts do not match!");
      console.log(`Difference: ${expectedDocs - count} documents missing.`);
      console.log("Possible Reasons: MongoDB batch insert write conflicts, network timeouts, or schema level document validation errors.\n");
    }

    // Group and sort keys alphabetically to list samples
    const sortedCoinIds = Object.keys(coinGroups).sort();
    
    console.log("--- First 20 Unique Coin IDs Imported ---");
    console.log(sortedCoinIds.slice(0, 20).join(", "));
    console.log("------------------------------------------\n");

    console.log("--- Last 20 Unique Coin IDs Imported ----");
    console.log(sortedCoinIds.slice(-20).join(", "));
    console.log("------------------------------------------\n");

    // Print document counts per coin
    console.log("--- Document Count Per Coin ---");
    const countsPerCoin = {};
    for (const record of allRecords) {
      countsPerCoin[record.coinId] = (countsPerCoin[record.coinId] || 0) + 1;
    }
    for (const cid of sortedCoinIds) {
      console.log(`- ${cid}: ${countsPerCoin[cid]} documents`);
    }
    console.log("---------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
