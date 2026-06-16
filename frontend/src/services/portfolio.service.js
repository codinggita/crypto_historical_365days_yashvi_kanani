import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const portfolioService = {
  getPortfolios: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.GET_ALL, { params });
    return response.data;
  },

  addPortfolioItem: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.PORTFOLIO.ADD, data);
    return response.data;
  },

  updatePortfolioItem: async (id, data) => {
    const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE(id), data);
    return response.data;
  },

  deletePortfolioItem: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.PORTFOLIO.DELETE(id));
    return response.data;
  },

  getPortfolioOverview: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.OVERVIEW);
    return response.data;
  },

  getPortfolioSummary: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.ANALYTICS_SUMMARY);
    return response.data;
  },

  getPortfolioDistribution: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.ANALYTICS_DISTRIBUTION);
    return response.data;
  },

  getPortfolioHistory: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.ANALYTICS_HISTORY);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.RECOMMENDATIONS);
    return response.data;
  },

  simulatePortfolio: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.SIMULATE, { params });
    return response.data;
  },
};

export default portfolioService;
