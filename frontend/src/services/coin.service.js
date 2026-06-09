import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const coinService = {
  /**
   * Fetch list of cryptocurrencies with optional filters / sorting / pagination
   * @param {Object} params - Query parameters (e.g. page, limit, sortBy, sortOrder)
   * @returns {Promise<Object>} API response data
   */
  getCoins: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Fetch details of a single coin by ID
   * @param {string} id - The unique coin identifier
   * @returns {Promise<Object>} API response data
   */
  getCoinById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Search for coins using a query string
   * @param {string} query - The search keyword
   * @returns {Promise<Object>} API response data
   */
  searchCoins: async (query) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.SEARCH, { params: { q: query } });
    return response.data;
  },

  /**
   * Get trending cryptocurrencies
   * @returns {Promise<Object>} API response data
   */
  getTrendingCoins: async () => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TRENDING);
    return response.data;
  },

  /**
   * Get top gaining coins based on daily return
   * @returns {Promise<Object>} API response data
   */
  getTopGainers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TOP_GAINERS);
    return response.data;
  },

  /**
   * Get top losing coins based on daily return
   * @returns {Promise<Object>} API response data
   */
  getTopLosers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TOP_LOSERS);
    return response.data;
  },

  /**
   * Fetch historical price data for a specific coin
   * @param {string} coinId - The unique coin identifier
   * @param {Object} [params] - Optional query parameters (e.g. days, interval)
   * @returns {Promise<Object>} API response data
   */
  getCoinHistory: async (coinId, params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.HISTORY(coinId), { params });
    return response.data;
  },

  /**
   * Fetch performance analytics for a specific coin
   * @param {string} coinId - The unique coin identifier
   * @returns {Promise<Object>} API response data
   */
  getCoinPerformance: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.PERFORMANCE(coinId));
    return response.data;
  },

  /**
   * Fetch volatility analytics for a specific coin
   * @param {string} coinId - The unique coin identifier
   * @returns {Promise<Object>} API response data
   */
  getCoinVolatility: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.VOLATILITY(coinId));
    return response.data;
  },

  /**
   * Compare multiple coins metrics (supports comparing 2 or 3 coins)
   * @param {string} coin1 - ID of the first coin
   * @param {string} coin2 - ID of the second coin
   * @param {string} [coin3] - Optional ID of the third coin
   * @returns {Promise<Object>} API response data
   */
  compareCoins: async (coin1, coin2, coin3) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.COMPARE(coin1, coin2, coin3));
    return response.data;
  },
};

export default coinService;
