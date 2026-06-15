import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const watchlistService = {
  /**
   * Fetch all bookmarks in the user's watchlist with optional filter/sort parameters
   * @param {Object} params - Query parameters (category, q, sortBy, sortOrder, page, limit)
   * @returns {Promise<Object>} API response data
   */
  getWatchlist: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.WATCHLIST.GET_ALL, { params });
    return response.data;
  },

  /**
   * Add a coin to the user's watchlist by its coinId
   * @param {string} coinId - The unique coin identifier
   * @param {Object} data - Optional body containing category and notes
   * @returns {Promise<Object>} API response data
   */
  addToWatchlist: async (coinId, data = {}) => {
    const response = await apiClient.post(API_ENDPOINTS.WATCHLIST.ADD(coinId), data);
    return response.data;
  },

  /**
   * Fetch a single bookmarked coin details
   * @param {string} id - The bookmark record database ID
   * @returns {Promise<Object>} API response data
   */
  getBookmarkById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.WATCHLIST.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Update a bookmark category and/or notes
   * @param {string} id - The bookmark record database ID
   * @param {Object} data - Body containing category and/or notes
   * @returns {Promise<Object>} API response data
   */
  updateBookmark: async (id, data) => {
    const response = await apiClient.patch(API_ENDPOINTS.WATCHLIST.UPDATE(id), data);
    return response.data;
  },

  /**
   * Remove a bookmark item from the user's watchlist by bookmark ID
   * @param {string} id - The bookmark record database ID
   * @returns {Promise<Object>} API response data
   */
  removeFromWatchlist: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.WATCHLIST.DELETE(id));
    return response.data;
  },

  /**
   * Check if a specific coin is already bookmarked by the user
   * @param {string} coinId - The unique coin identifier
   * @returns {Promise<Object>} API response data
   */
  checkBookmark: async (coinId) => {
    const response = await apiClient.get(API_ENDPOINTS.WATCHLIST.CHECK(coinId));
    return response.data;
  },

  /**
   * Fetch user bookmark preference analytics
   * @returns {Promise<Object>} API response data
   */
  getBookmarkAnalytics: async () => {
    const response = await apiClient.get(API_ENDPOINTS.WATCHLIST.ANALYTICS);
    return response.data;
  },

  /**
   * Fetch globally trending bookmarks
   * @param {number} limit - Maximum number of trending items to fetch
   * @returns {Promise<Object>} API response data
   */
  getTrendingBookmarks: async (limit = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.WATCHLIST.TRENDING, { params: { limit } });
    return response.data;
  },
};

export default watchlistService;
