import apiClient from '../api/apiClient';

export const statsService = {
  getTotalMarketCap: async () => {
    const response = await apiClient.get('/stats/market-cap');
    return response.data;
  },

  getAveragePrice: async () => {
    const response = await apiClient.get('/stats/average-price');
    return response.data;
  },

  getAverageVolume: async () => {
    const response = await apiClient.get('/stats/average-volume');
    return response.data;
  },

  getHighestMarketCap: async () => {
    const response = await apiClient.get('/stats/highest-market-cap');
    return response.data;
  },

  getHighestVolume: async () => {
    const response = await apiClient.get('/stats/highest-volume');
    return response.data;
  },

  getTopGainers: async (params = {}) => {
    const response = await apiClient.get('/stats/top-gainers', { params });
    return response.data;
  },

  getTopLosers: async (params = {}) => {
    const response = await apiClient.get('/stats/top-losers', { params });
    return response.data;
  },

  getMonthlyAnalysis: async () => {
    const response = await apiClient.get('/stats/monthly-analysis');
    return response.data;
  },

  getCoinCount: async () => {
    const response = await apiClient.get('/stats/coin-count');
    return response.data;
  },

  getRankDistribution: async () => {
    const response = await apiClient.get('/stats/rank-distribution');
    return response.data;
  },

  getPriceDistribution: async () => {
    const response = await apiClient.get('/stats/price-distribution');
    return response.data;
  },

  getVolatilityDistribution: async () => {
    const response = await apiClient.get('/stats/volatility-distribution');
    return response.data;
  },

  getMarketSummary: async () => {
    const response = await apiClient.get('/stats/market-summary');
    return response.data;
  },

  getDailyAnalysis: async () => {
    const response = await apiClient.get('/stats/daily-analysis');
    return response.data;
  },

  getYearlyAnalysis: async () => {
    const response = await apiClient.get('/stats/yearly-analysis');
    return response.data;
  },
};

export default statsService;
