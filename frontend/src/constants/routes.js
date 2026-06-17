/**
 * Application Route Constants
 * Central place for all route paths used across the app
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected
  DASHBOARD: '/dashboard',
  COINS: '/coins',
  COIN_DETAILS: '/coins/:id',
  COIN_DETAILS_PATH: (id) => `/coins/${id}`,
  ANALYTICS: '/analytics',
  STATS: '/stats',
  STATISTICS: '/statistics',
  WATCHLIST: '/watchlist',
  PORTFOLIO: '/portfolio',
  PROFILE: '/profile',
  ADMIN: '/admin',

  // Fallback
  NOT_FOUND: '/not-found',
};

export default ROUTES;
