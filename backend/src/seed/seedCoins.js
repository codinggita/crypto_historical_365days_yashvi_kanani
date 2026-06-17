import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

import mongoose from "mongoose";
import Coin from "../models/Coin.js";

// ── Coin base definitions ──────────────────────────────────────────────────────
const COINS = [
  { coinId: "bitcoin",  name: "Bitcoin",   symbol: "BTC", rank: 1,  basePrice: 45000, marketCap: 880e9,  volume: 25e9,  volatility: 1.2, category: "Layer-1", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",    tags: ["pow", "store-of-value", "large-cap"], circ: 19_690_000, total: 21_000_000 },
  { coinId: "ethereum", name: "Ethereum",  symbol: "ETH", rank: 2,  basePrice: 3200,  marketCap: 385e9,  volume: 14e9,  volatility: 1.7, category: "Layer-1", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",    tags: ["pos", "smart-contracts", "large-cap", "defi"], circ: 120_100_000, total: 120_100_000 },
  { coinId: "binancecoin", name: "BNB",    symbol: "BNB", rank: 3,  basePrice: 380,   marketCap: 58e9,   volume: 1.8e9, volatility: 2.0, category: "Exchange", image: "https://cryptologos.cc/logos/bnb-bnb-logo.png",         tags: ["exchange", "cefi", "large-cap"], circ: 153_000_000, total: 200_000_000 },
  { coinId: "solana",   name: "Solana",    symbol: "SOL", rank: 4,  basePrice: 155,   marketCap: 68e9,   volume: 4.5e9, volatility: 3.1, category: "Layer-1", image: "https://cryptologos.cc/logos/solana-sol-logo.png",     tags: ["pos", "high-throughput", "mid-cap"], circ: 446_000_000, total: 575_000_000 },
  { coinId: "ripple",   name: "Ripple",    symbol: "XRP", rank: 5,  basePrice: 0.55,  marketCap: 30e9,   volume: 900e6, volatility: 1.6, category: "Payment", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png",        tags: ["payment", "enterprise", "cross-border"], circ: 55_300_000_000, total: 100_000_000_000 },
  { coinId: "dogecoin", name: "Dogecoin",  symbol: "DOGE",rank: 6,  basePrice: 0.14,  marketCap: 20e9,   volume: 1.1e9, volatility: 4.2, category: "Meme",    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",  tags: ["meme", "community", "pow"], circ: 144_400_000_000, total: 144_400_000_000 },
  { coinId: "cardano",  name: "Cardano",   symbol: "ADA", rank: 7,  basePrice: 0.45,  marketCap: 16e9,   volume: 380e6, volatility: 1.4, category: "Layer-1", image: "https://cryptologos.cc/logos/cardano-ada-logo.png",    tags: ["pos", "research-driven", "mid-cap"], circ: 35_600_000_000, total: 45_000_000_000 },
  { coinId: "avalanche",name: "Avalanche", symbol: "AVAX",rank: 8,  basePrice: 35,    marketCap: 14e9,   volume: 320e6, volatility: 2.8, category: "Layer-1", image: "https://cryptologos.cc/logos/avalanche-avax-logo.png", tags: ["pos", "subnets", "mid-cap"], circ: 400_000_000, total: 720_000_000 },
  { coinId: "polkadot", name: "Polkadot",  symbol: "DOT", rank: 9,  basePrice: 7.2,   marketCap: 10e9,   volume: 190e6, volatility: 1.9, category: "Layer-0", image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",tags: ["interoperability", "multi-chain"], circ: 1_430_000_000, total: 1_430_000_000 },
  { coinId: "chainlink",name: "Chainlink", symbol: "LINK",rank: 10, basePrice: 14.5,  marketCap: 8.5e9,  volume: 270e6, volatility: 2.2, category: "Oracle",  image: "https://cryptologos.cc/logos/chainlink-link-logo.png", tags: ["oracle", "data-feed", "defi"], circ: 587_000_000, total: 1_000_000_000 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const rnd  = (min, max) => Math.random() * (max - min) + min;
const snap = (n, d = 6)  => Math.round(n * 10 ** d) / 10 ** d;

/**
 * Generate 365 daily snapshots for one coin starting from 365 days ago.
 * Price follows a geometric random walk so it looks realistic.
 */
function generateHistory(coin) {
  const records = [];
  const now = new Date();
  let price = coin.basePrice;

  for (let day = 364; day >= 0; day--) {
    // Daily return: normally distributed ≈ ±3%
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

// ── Main ───────────────────────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI environment variable is missing.");

    console.log("🔌 Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("✅ Database connected.");

    console.log("🗑️  Clearing existing coin data...");
    await Coin.deleteMany({});
    await mongoose.connection.db.collection("coins").dropIndexes();
    console.log("✅ Existing data cleared + old indexes dropped.");

    // Generate all records for all coins
    let allRecords = [];
    for (const coin of COINS) {
      const history = generateHistory(coin);
      allRecords = allRecords.concat(history);
      console.log(`   📊 ${coin.name}: ${history.length} daily snapshots generated`);
    }

    console.log(`\n📤 Inserting ${allRecords.length} records (${COINS.length} coins × 365 days)...`);
    // Insert in batches of 500 to avoid memory issues
    const BATCH = 500;
    for (let i = 0; i < allRecords.length; i += BATCH) {
      await Coin.insertMany(allRecords.slice(i, i + BATCH), { ordered: false });
      process.stdout.write(`   ✓ Inserted up to record ${Math.min(i + BATCH, allRecords.length)}\r`);
    }

    const count = await Coin.countDocuments();
    console.log(`\n\n🎉 Successfully seeded ${count} historical records!`);
    console.log(`   ${COINS.length} coins × 365 days = ${count} total snapshots`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
