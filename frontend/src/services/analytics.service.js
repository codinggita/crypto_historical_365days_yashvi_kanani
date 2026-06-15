import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const analyticsService = {
  // Price analytics
  getHighestPrice: async () => {
    const response = await apiClient.get('/analytics/price/highest');
    return response.data;
  },

  getLowestPrice: async () => {
    const response = await apiClient.get('/analytics/price/lowest');
    return response.data;
  },

  getAveragePrice: async () => {
    const response = await apiClient.get('/analytics/price/average');
    return response.data;
  },

  getPriceTrend: async () => {
    const response = await apiClient.get('/analytics/price/trend');
    return response.data;
  },

  getPriceGrowth: async () => {
    const response = await apiClient.get('/analytics/price/growth');
    return response.data;
  },

  getPriceDrop: async () => {
    const response = await apiClient.get('/analytics/price/drop');
    return response.data;
  },

  // Volume analytics
  getHighestVolume: async () => {
    const response = await apiClient.get('/analytics/volume/highest');
    return response.data;
  },

  getLowestVolume: async () => {
    const response = await apiClient.get('/analytics/volume/lowest');
    return response.data;
  },

  getAverageVolume: async () => {
    const response = await apiClient.get('/analytics/volume/average');
    return response.data;
  },

  getVolumeSpike: async () => {
    const response = await apiClient.get('/analytics/volume/spike');
    return response.data;
  },

  // Returns analytics
  getTopReturns: async () => {
    const response = await apiClient.get('/analytics/returns/top');
    return response.data;
  },

  getNegativeReturns: async () => {
    const response = await apiClient.get('/analytics/returns/negative');
    return response.data;
  },

  getCumulativeReturns: async () => {
    const response = await apiClient.get('/analytics/returns/cumulative');
    return response.data;
  },

  // Volatility analytics
  getHighVolatility: async () => {
    const response = await apiClient.get('/analytics/volatility/high');
    return response.data;
  },

  // Stats endpoints
  getStatsMarketSummary: async () => {
    const response = await apiClient.get('/stats/market-summary');
    return response.data;
  },

  getStatsTopGainers: async (params = {}) => {
    const response = await apiClient.get('/stats/top-gainers', { params });
    return response.data;
  },

  getStatsTopLosers: async (params = {}) => {
    const response = await apiClient.get('/stats/top-losers', { params });
    return response.data;
  },
};

export default analyticsService;

