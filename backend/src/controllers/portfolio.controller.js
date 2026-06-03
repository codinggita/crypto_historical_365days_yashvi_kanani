import * as portfolioService from "../services/portfolio.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Add coin to user portfolio
 */
export const addPortfolioItem = asyncHandler(async (req, res) => {
  const item = await portfolioService.addPortfolioItem(req.user._id, req.body);
  return res.status(201).json(
    new ApiResponse(201, item, "Coin added to portfolio successfully")
  );
});

/**
 * Get user's portfolios list (with pagination & profit-loss filter)
 */
export const getPortfolios = asyncHandler(async (req, res) => {
  const { items, meta, totals } = await portfolioService.getPortfolios(req.user._id, req.query);
  return res.status(200).json(
    new ApiResponse(200, { items, totals }, "Portfolio items fetched successfully", meta)
  );
});

/**
 * Get single portfolio transaction details
 */
export const getPortfolioItemById = asyncHandler(async (req, res) => {
  const item = await portfolioService.getPortfolioItemById(req.user._id, req.params.id);
  return res.status(200).json(
    new ApiResponse(200, item, "Portfolio item fetched successfully")
  );
});

/**
 * Update portfolio item buy price or quantity
 */
export const updatePortfolioItem = asyncHandler(async (req, res) => {
  const item = await portfolioService.updatePortfolioItem(req.user._id, req.params.id, req.body);
  return res.status(200).json(
    new ApiResponse(200, item, "Portfolio item updated successfully")
  );
});

/**
 * Remove portfolio transaction
 */
export const deletePortfolioItem = asyncHandler(async (req, res) => {
  await portfolioService.deletePortfolioItem(req.user._id, req.params.id);
  return res.status(200).json(
    new ApiResponse(200, null, "Portfolio item removed successfully")
  );
});

/**
 * Fetch portfolio statistics and performance analytics summary
 */
export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const summary = await portfolioService.getAnalyticsSummary(req.user._id);
  return res.status(200).json(
    new ApiResponse(200, summary, "Portfolio analytics summary fetched successfully")
  );
});

/**
 * Fetch coin asset percentage allocation distribution
 */
export const getAnalyticsDistribution = asyncHandler(async (req, res) => {
  const distribution = await portfolioService.getAnalyticsDistribution(req.user._id);
  return res.status(200).json(
    new ApiResponse(200, distribution, "Portfolio assets distribution fetched successfully")
  );
});

/**
 * Fetch monthly growth simulation and accumulation history
 */
export const getAnalyticsHistory = asyncHandler(async (req, res) => {
  const history = await portfolioService.getAnalyticsHistory(req.user._id);
  return res.status(200).json(
    new ApiResponse(200, history, "Portfolio analytics history fetched successfully")
  );
});

/**
 * Fetch unified advanced dashboard overview including portfolio metrics and chronological activities feed
 */
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const overview = await portfolioService.getDashboardOverview(req.user._id);
  return res.status(200).json(
    new ApiResponse(200, overview, "Advanced dashboard overview fetched successfully")
  );
});
