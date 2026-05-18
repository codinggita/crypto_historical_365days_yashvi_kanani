import * as analyticsService from "../services/analytics.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview();
  return res.status(200).json(
    new ApiResponse(200, data, "Overview statistics fetched successfully")
  );
});

export const getTopGainers = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopGainers();
  return res.status(200).json(
    new ApiResponse(200, data, "Top gainers fetched successfully")
  );
});

export const getTopLosers = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopLosers();
  return res.status(200).json(
    new ApiResponse(200, data, "Top losers fetched successfully")
  );
});

export const getHighestMarketCap = asyncHandler(async (req, res) => {
  const data = await analyticsService.getHighestMarketCap();
  return res.status(200).json(
    new ApiResponse(200, data, "Highest market cap coins fetched successfully")
  );
});

export const getHighestVolume = asyncHandler(async (req, res) => {
  const data = await analyticsService.getHighestVolume();
  return res.status(200).json(
    new ApiResponse(200, data, "Highest traded volume coins fetched successfully")
  );
});

export const getHighVolatility = asyncHandler(async (req, res) => {
  const data = await analyticsService.getHighVolatility();
  return res.status(200).json(
    new ApiResponse(200, data, "High volatility coins fetched successfully")
  );
});

export const getMonthlyReport = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMonthlyReport();
  return res.status(200).json(
    new ApiResponse(200, data, "Monthly analytical report fetched successfully")
  );
});

export const getYearlyReport = asyncHandler(async (req, res) => {
  const data = await analyticsService.getYearlyReport();
  return res.status(200).json(
    new ApiResponse(200, data, "Yearly analytical report fetched successfully")
  );
});

export const getMarketSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMarketSummary();
  return res.status(200).json(
    new ApiResponse(200, data, "Market summary fetched successfully")
  );
});

export const getPriceRanges = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPriceRanges();
  return res.status(200).json(
    new ApiResponse(200, data, "Price range distribution fetched successfully")
  );
});
