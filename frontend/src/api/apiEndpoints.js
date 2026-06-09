export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  COINS: {
    GET_ALL: '/coins',
    GET_BY_ID: (id) => `/coins/${id}`,
    SEARCH: '/search/coins',
    LATEST: '/coins/latest',
    TOP_GAINERS: '/coins/top-gainers',
    TOP_LOSERS: '/coins/top-losers',
    TOP_MARKET_CAP: '/coins/top-market-cap',
    TOP_VOLUME: '/coins/top-volume',
    TRENDING: '/coins/trending',
    MARKET_SUMMARY: '/coins/market/summary',
    FILTER: '/coins',
    HISTORY: (coinId) => `/coins/history/${coinId}`,
    PERFORMANCE: (coinId) => `/coins/performance/${coinId}`,
    VOLATILITY: (coinId) => `/coins/volatility/${coinId}`,
    COMPARE: (coin1, coin2, coin3) =>
      coin3 ? `/coins/compare/${coin1}/${coin2}/${coin3}` : `/coins/compare/${coin1}/${coin2}`,
  },
  ANALYTICS: {
    MARKET_SUMMARY: '/analytics/market/summary',
    PRICE_ANALYTICS: (coinId) => `/analytics/price/history/${coinId}`,
    VOLUME_ANALYTICS: '/analytics/volume/highest',
    RETURN_ANALYTICS: '/analytics/returns/top',
    VOLATILITY_ANALYTICS: '/analytics/volatility/high',
  },
  WATCHLIST: {
    GET_ALL: '/bookmarks',
    ADD: (coinId) => `/bookmarks/${coinId}`,
    DELETE: (id) => `/bookmarks/${id}`,
    CHECK: (coinId) => `/bookmarks/check/${coinId}`,
    ANALYTICS: '/bookmarks/analytics/summary',
  },
  STATS: {
    MARKET_CAP: '/stats/market-cap',
    AVERAGE_PRICE: '/stats/average-price',
    AVERAGE_VOLUME: '/stats/average-volume',
  },
};

export default API_ENDPOINTS;
