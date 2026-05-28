import * as statsService from "../services/stats.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getTotalMarketCap = asyncHandler(async (req, res) => {
  const value = await statsService.getTotalMarketCap();
  res.json(new ApiResponse(200, { totalMarketCap: value }, "Total market capitalization calculated"));
});

export const getAveragePrice = asyncHandler(async (req, res) => {
  const value = await statsService.getAveragePrice();
  res.json(new ApiResponse(200, { averagePrice: value }, "Average market price calculated"));
});

export const getAverageVolume = asyncHandler(async (req, res) => {
  const value = await statsService.getAverageVolume();
  res.json(new ApiResponse(200, { averageVolume: value }, "Average trading volume calculated"));
});

export const getHighestMarketCap = asyncHandler(async (req, res) => {
  const coin = await statsService.getHighestMarketCap();
  res.json(new ApiResponse(200, coin, "Highest market cap coin fetched"));
});

export const getHighestVolume = asyncHandler(async (req, res) => {
  const coin = await statsService.getHighestVolume();
  res.json(new ApiResponse(200, coin, "Highest traded volume coin fetched"));
});

export const getTopGainers = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const coins = await statsService.getTopGainers(limit);
  res.json(new ApiResponse(200, coins, "Top gainers fetched"));
});

export const getTopLosers = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const coins = await statsService.getTopLosers(limit);
  res.json(new ApiResponse(200, coins, "Top losers fetched"));
});

export const getMonthlyAnalysis = asyncHandler(async (req, res) => {
  const data = await statsService.getMonthlyAnalysis();
  res.json(new ApiResponse(200, data, "Monthly market trends analysis completed"));
});

export const getCoinCount = asyncHandler(async (req, res) => {
  const count = await statsService.getCoinCount();
  res.json(new ApiResponse(200, { coinCount: count }, "Total unique coins counted"));
});

export const getRankDistribution = asyncHandler(async (req, res) => {
  const data = await statsService.getRankDistribution();
  res.json(new ApiResponse(200, data, "Rank distribution analyzed"));
});

export const getPriceDistribution = asyncHandler(async (req, res) => {
  const data = await statsService.getPriceDistribution();
  res.json(new ApiResponse(200, data, "Price distribution analyzed"));
});

export const getVolatilityDistribution = asyncHandler(async (req, res) => {
  const data = await statsService.getVolatilityDistribution();
  res.json(new ApiResponse(200, data, "Volatility distribution analyzed"));
});

export const getMarketSummary = asyncHandler(async (req, res) => {
  const summary = await statsService.getMarketSummary();
  res.json(new ApiResponse(200, summary, "Overall market summary generated"));
});

export const getDailyAnalysis = asyncHandler(async (req, res) => {
  const data = await statsService.getDailyAnalysis();
  res.json(new ApiResponse(200, data, "Daily analysis generated"));
});

export const getYearlyAnalysis = asyncHandler(async (req, res) => {
  const data = await statsService.getYearlyAnalysis();
  res.json(new ApiResponse(200, data, "Yearly analysis generated"));
});
