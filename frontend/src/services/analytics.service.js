import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const analyticsService = {
  /**
   * Fetch market summary analytics data
   * @returns {Promise<Object>} API response data
   */
  getMarketSummary: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.MARKET_SUMMARY);
    return response.data;
  },

  /**
   * Fetch price analytics. If a coin ID is provided, fetches history for that coin.
   * Otherwise, fetches general price statistics.
   * @param {string} [coinId] - Optional coin ID to fetch price history
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Object>} API response data
   */
  getPriceAnalytics: async (coinId = null, params = {}) => {
    const url = coinId 
      ? API_ENDPOINTS.ANALYTICS.PRICE_ANALYTICS(coinId) 
      : '/analytics/price/average';
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  /**
   * Fetch trading volume analytics (e.g. highest traded coins)
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Object>} API response data
   */
  getVolumeAnalytics: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.VOLUME_ANALYTICS, { params });
    return response.data;
  },

  /**
   * Fetch daily/cumulative return analytics
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Object>} API response data
   */
  getReturnAnalytics: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.RETURN_ANALYTICS, { params });
    return response.data;
  },

  /**
   * Fetch market volatility analytics (e.g. high volatility coins)
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Object>} API response data
   */
  getVolatilityAnalytics: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.VOLATILITY_ANALYTICS, { params });
    return response.data;
  },
};

export default analyticsService;
