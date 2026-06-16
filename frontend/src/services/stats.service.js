import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const statsService = {
  getTotalMarketCap: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.MARKET_CAP);
    return response.data;
  },

  getAveragePrice: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.AVERAGE_PRICE);
    return response.data;
  },

  getAverageVolume: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.AVERAGE_VOLUME);
    return response.data;
  },

  getHighestMarketCap: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.HIGHEST_MARKET_CAP);
    return response.data;
  },

  getHighestVolume: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.HIGHEST_VOLUME);
    return response.data;
  },

  getTopGainers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.TOP_GAINERS, { params });
    return response.data;
  },

  getTopLosers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.TOP_LOSERS, { params });
    return response.data;
  },

  getMonthlyAnalysis: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.MONTHLY_ANALYSIS);
    return response.data;
  },

  getCoinCount: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.COIN_COUNT);
    return response.data;
  },

  getRankDistribution: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.RANK_DISTRIBUTION);
    return response.data;
  },

  getPriceDistribution: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.PRICE_DISTRIBUTION);
    return response.data;
  },

  getVolatilityDistribution: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.VOLATILITY_DISTRIBUTION);
    return response.data;
  },

  getMarketSummary: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.MARKET_SUMMARY);
    return response.data;
  },

  getDailyAnalysis: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.DAILY_ANALYSIS);
    return response.data;
  },

  getYearlyAnalysis: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.YEARLY_ANALYSIS);
    return response.data;
  },
};

export default statsService;
