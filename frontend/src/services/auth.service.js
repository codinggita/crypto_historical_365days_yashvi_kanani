import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration details (name, email, password)
   * @returns {Promise<Object>} API response data
   */
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Log in an existing user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise<Object>} API response data
   */
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Log out the currently authenticated user
   * @returns {Promise<Object>} API response data
   */
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * Fetch the profile details of the currently authenticated user
   * @returns {Promise<Object>} API response data
   */
  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  /**
   * Update profile information
   * @param {Object} profileData - Updated profile fields
   * @returns {Promise<Object>} API response data
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, profileData);
    return response.data;
  },

  /**
   * Change current password
   * @param {Object} passwordData - Current password and new password
   * @returns {Promise<Object>} API response data
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  /**
   * Trigger forgot password flow
   * @param {Object} emailData - Email address to receive reset link
   * @returns {Promise<Object>} API response data
   */
  forgotPassword: async (emailData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, emailData);
    return response.data;
  },

  /**
   * Reset password using a verification token
   * @param {Object} resetData - Token and new password
   * @returns {Promise<Object>} API response data
   */
  resetPassword: async (resetData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
    return response.data;
  },
};

export default authService;
