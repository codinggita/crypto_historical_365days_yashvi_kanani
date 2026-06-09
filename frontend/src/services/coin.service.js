import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const coinService = {
  /**
   * Fetch list of cryptocurrencies with optional filters / sorting / pagination
   */
  getCoins: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Fetch details of a single coin by ID
   */
  getCoinById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Search for coins using a query string
   */
  searchCoins: async (query) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.SEARCH, { params: { q: query } });
    return response.data;
  },

  /**
   * Get the latest coins added to the system
   */
  getLatestCoins: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.LATEST, { params });
    return response.data;
  },

  /**
   * Get trending cryptocurrencies
   */
  getTrendingCoins: async () => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TRENDING);
    return response.data;
  },

  /**
   * Get top gaining coins based on daily return
   */
  getTopGainers: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TOP_GAINERS, { params });
    return response.data;
  },

  /**
   * Get top losing coins based on daily return
   */
  getTopLosers: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TOP_LOSERS, { params });
    return response.data;
  },

  /**
   * Get coins sorted by market cap (top)
   */
  getTopMarketCap: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TOP_MARKET_CAP, { params });
    return response.data;
  },

  /**
   * Get coins sorted by volume (top)
   */
  getTopVolume: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.TOP_VOLUME, { params });
    return response.data;
  },

  /**
   * Get market summary stats
   */
  getMarketSummary: async () => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.MARKET_SUMMARY);
    return response.data;
  },

  /**
   * Fetch historical price data for a specific coin
   */
  getCoinHistory: async (coinId, params) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.HISTORY(coinId), { params });
    return response.data;
  },

  /**
   * Fetch performance analytics for a specific coin
   */
  getCoinPerformance: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.PERFORMANCE(coinId));
    return response.data;
  },

  /**
   * Fetch volatility analytics for a specific coin
   */
  getCoinVolatility: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.VOLATILITY(coinId));
    return response.data;
  },

  /**
   * Fetch price only for a specific coin
   */
  getCoinPriceOnly: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.PRICE(coinId));
    return response.data;
  },

  /**
   * Fetch market cap details for a specific coin
   */
  getCoinMarketCapDetails: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.MARKET_CAP(coinId));
    return response.data;
  },

  /**
   * Fetch volume details for a specific coin
   */
  getCoinVolumeDetails: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.VOLUME(coinId));
    return response.data;
  },

  /**
   * Fetch returns analytics for a specific coin
   */
  getCoinReturns: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.RETURNS(coinId));
    return response.data;
  },

  /**
   * Compare multiple coins metrics
   */
  compareCoins: async (coin1, coin2, coin3) => {
    const response = await apiClient.get(API_ENDPOINTS.COINS.COMPARE(coin1, coin2, coin3));
    return response.data;
  },
};

export default coinService;
