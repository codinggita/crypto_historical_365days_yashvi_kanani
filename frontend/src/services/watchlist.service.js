import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const watchlistService = {
  /**
   * Fetch all bookmarks in the user's watchlist
   * @returns {Promise<Object>} API response data
   */
  getWatchlist: async () => {
    const response = await apiClient.get(API_ENDPOINTS.WATCHLIST.GET_ALL);
    return response.data;
  },

  /**
   * Add a coin to the user's watchlist by its coinId
   * @param {string} coinId - The unique coin identifier
   * @returns {Promise<Object>} API response data
   */
  addToWatchlist: async (coinId) => {
    const response = await apiClient.post(API_ENDPOINTS.WATCHLIST.ADD(coinId));
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
};

export default watchlistService;
