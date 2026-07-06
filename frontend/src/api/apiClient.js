import axios from 'axios';

// Retrieve base URL from Vite environment variables (fallback to local backend port 5000)
const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create a reusable Axios instance
const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token and normalize URLs
apiClient.interceptors.request.use(
  (config) => {
    // Normalize relative URLs to avoid duplicate /api/v1 prefixes or missing ones
    if (config.url && !config.url.startsWith('http://') && !config.url.startsWith('https://')) {
      let cleanUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;
      
      const hasBaseV1 = config.baseURL && (config.baseURL.endsWith('/api/v1') || config.baseURL.endsWith('/api/v1/'));
      if (hasBaseV1 && cleanUrl.startsWith('/api/v1')) {
        cleanUrl = cleanUrl.substring(7); // Remove the "/api/v1" prefix
      }
      
      const baseHasV1 = config.baseURL && config.baseURL.includes('/api/v1');
      if (!baseHasV1 && !cleanUrl.startsWith('/api/v1')) {
        cleanUrl = `/api/v1${cleanUrl}`;
      }
      
      config.url = cleanUrl;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const standardizedError = {
      message: 'An unexpected error occurred.',
      status: null,
      code: null,
      data: null,
    };

    if (error.response) {
      // Server responded with a status outside 2xx range
      const { status, data } = error.response;
      standardizedError.status = status;
      standardizedError.data = data;
      
      if (data?.errors && Array.isArray(data.errors)) {
        // Check if elements are objects (old format) or strings (new format)
        const msgs = data.errors.map(err => {
          if (typeof err === 'object') {
            return Object.values(err).join(', ');
          }
          return err;
        });
        standardizedError.message = `${data.message || 'Validation failed'}: ${msgs.join('; ')}`;
      } else if (data?.errors && typeof data.errors === 'object') {
        const msgs = Object.values(data.errors);
        standardizedError.message = `${data.message || 'Validation failed'}: ${msgs.join('; ')}`;
      } else {
        standardizedError.message = data?.message || data?.error || `Error: ${status}`;
      }

      switch (status) {
        case 401:
          standardizedError.message = data?.message || 'Session expired. Please log in again.';
          break;
        case 403:
          standardizedError.message = data?.message || 'Access denied. You do not have permission.';
          break;
        case 404:
          standardizedError.message = data?.message || 'Requested resource not found.';
          break;
        case 500:
          standardizedError.message = data?.message || 'Internal server error. Please try again later.';
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request was made but no response was received
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        standardizedError.message = 'Request timeout. Please check your network connection.';
        standardizedError.code = 'TIMEOUT';
      } else {
        standardizedError.message = 'Network error. Please check your internet connection.';
        standardizedError.code = 'NETWORK_ERROR';
      }
    } else {
      // Configuration error during request setup
      standardizedError.message = error.message;
    }

    return Promise.reject(standardizedError);
  }
);

export default apiClient;
