import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coin",
      required: true,
      index: true,
    },
    coinName: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    buyPrice: {
      type: Number,
      required: true,
      min: [0, "Buy price cannot be negative"],
    },
    currentPrice: {
      type: Number,
      required: true,
      min: [0, "Current price cannot be negative"],
    },
    investedAmount: {
      type: Number,
      default: 0,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    profitLoss: {
      type: Number,
      default: 0,
    },
    profitLossPercentage: {
      type: Number,
      default: 0,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate invested amount, current value, and profit/loss values automatically
portfolioSchema.pre("save", function () {
  this.investedAmount = this.quantity * this.buyPrice;
  this.currentValue = this.quantity * this.currentPrice;
  this.profitLoss = this.currentValue - this.investedAmount;
  this.profitLossPercentage = this.investedAmount > 0 
    ? (this.profitLoss / this.investedAmount) * 100 
    : 0;
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
