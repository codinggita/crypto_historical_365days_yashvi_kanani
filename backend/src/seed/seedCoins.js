import "dotenv/config";
import mongoose from "mongoose";
import Coin from "../models/Coin.js";

const mockCoins = [
  {
    coinId: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    rank: 1,
    price: 67250.45,
    marketCap: 1320000000000,
    volume: 28500000000,
    dailyReturn: 2.45,
    volatility: 1.25,
    circulatingSupply: 19690000,
    totalSupply: 21000000,
    maxSupply: 21000000,
    category: "Layer-1",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    marketStatus: "active",
    tags: ["pow", "store-of-value", "large-cap"],
    timestamp: new Date()
  },
  {
    coinId: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    rank: 2,
    price: 3780.12,
    marketCap: 454000000000,
    volume: 16200000000,
    dailyReturn: 4.82,
    volatility: 1.75,
    circulatingSupply: 120100000,
    totalSupply: 120100000,
    maxSupply: 0,
    category: "Layer-1",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    marketStatus: "active",
    tags: ["pos", "smart-contracts", "large-cap", "defi"],
    timestamp: new Date()
  },
  {
    coinId: "solana",
    name: "Solana",
    symbol: "SOL",
    rank: 5,
    price: 165.75,
    marketCap: 74000000000,
    volume: 4800000000,
    dailyReturn: -2.35,
    volatility: 3.20,
    circulatingSupply: 446000000,
    totalSupply: 575000000,
    maxSupply: 0,
    category: "Layer-1",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
    marketStatus: "active",
    tags: ["pos", "high-throughput", "mid-cap", "web3"],
    timestamp: new Date()
  },
  {
    coinId: "cardano",
    name: "Cardano",
    symbol: "ADA",
    rank: 10,
    price: 0.48,
    marketCap: 17100000000,
    volume: 420000000,
    dailyReturn: 1.15,
    volatility: 1.45,
    circulatingSupply: 35600000000,
    totalSupply: 45000000000,
    maxSupply: 45000000000,
    category: "Layer-1",
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    marketStatus: "active",
    tags: ["pos", "research-driven", "mid-cap"],
    timestamp: new Date()
  },
  {
    coinId: "ripple",
    name: "Ripple",
    symbol: "XRP",
    rank: 7,
    price: 0.52,
    marketCap: 28800000000,
    volume: 950000000,
    dailyReturn: -0.85,
    volatility: 1.65,
    circulatingSupply: 55300000000,
    totalSupply: 100000000000,
    maxSupply: 100000000000,
    category: "Payment",
    image: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
    marketStatus: "active",
    tags: ["payment", "enterprise", "cross-border"],
    timestamp: new Date()
  },
  {
    coinId: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    rank: 8,
    price: 0.145,
    marketCap: 20900000000,
    volume: 1250000000,
    dailyReturn: 6.78,
    volatility: 4.10,
    circulatingSupply: 144400000000,
    totalSupply: 144400000000,
    maxSupply: 0,
    category: "Meme",
    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
    marketStatus: "active",
    tags: ["meme", "community", "pow"],
    timestamp: new Date()
  },
  {
    coinId: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    rank: 14,
    price: 6.85,
    marketCap: 9800000000,
    volume: 195000000,
    dailyReturn: -1.25,
    volatility: 1.85,
    circulatingSupply: 1430000000,
    totalSupply: 1430000000,
    maxSupply: 0,
    category: "Layer-0",
    image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
    marketStatus: "active",
    tags: ["interoperability", "multi-chain", "pos"],
    timestamp: new Date()
  },
  {
    coinId: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    rank: 15,
    price: 15.65,
    marketCap: 9200000000,
    volume: 290000000,
    dailyReturn: 3.45,
    volatility: 2.15,
    circulatingSupply: 587000000,
    totalSupply: 1000000000,
    maxSupply: 1000000000,
    category: "Oracle",
    image: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    marketStatus: "active",
    tags: ["oracle", "data-feed", "defi"],
    timestamp: new Date()
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is missing.");
    }
    
    console.log("Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully.");

    console.log("Clearing existing coins data...");
    await Coin.deleteMany({});
    console.log("Existing coins cleared.");

    console.log("Inserting new mock coins...");
    const createdCoins = await Coin.insertMany(mockCoins);
    console.log(`Successfully seeded ${createdCoins.length} coins!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error.message);
    process.exit(1);
  }
};

seedDB();
