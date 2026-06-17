import apiClient from '../api/apiClient';

export const adminService = {
  // Overview KPI stats
  getStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  // User management
  getUsers: async (params = {}) => {
    const res = await apiClient.get('/admin/users', { params });
    return res.data;
  },

  getUserById: async (id) => {
    const res = await apiClient.get(`/admin/users/${id}`);
    return res.data;
  },

  updateUserRole: async (id, role) => {
    const res = await apiClient.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  updateUserStatus: async (id, isActive) => {
    const res = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return res.data;
  },

  // Activity logs
  getLogs: async (params = {}) => {
    const res = await apiClient.get('/admin/logs', { params });
    return res.data;
  },

  // Analytics
  getWatchlistAnalytics: async () => {
    const res = await apiClient.get('/admin/analytics/watchlist');
    return res.data;
  },

  getPortfolioAnalytics: async () => {
    const res = await apiClient.get('/admin/analytics/portfolio');
    return res.data;
  },

  getSearchAnalytics: async (params = {}) => {
    const res = await apiClient.get('/admin/analytics/search', { params });
    return res.data;
  },

  // System health
  getHealth: async () => {
    const res = await apiClient.get('/admin/health');
    return res.data;
  },

  // Coin analytics (reuse analytics endpoints)
  getCoinAnalytics: async () => {
    const [overview, trending, gainers, losers, catDist] = await Promise.allSettled([
      apiClient.get('/analytics/overview'),
      apiClient.get('/analytics/coins/trending'),
      apiClient.get('/analytics/coins/top-gainers'),
      apiClient.get('/analytics/coins/top-losers'),
      apiClient.get('/analytics/market/category-distribution'),
    ]);
    const ok = (r) => (r.status === 'fulfilled' ? r.value.data : null);
    return {
      overview: ok(overview),
      trending: ok(trending),
      gainers: ok(gainers),
      losers: ok(losers),
      categoryDistribution: ok(catDist),
    };
  },
};

export default adminService;
