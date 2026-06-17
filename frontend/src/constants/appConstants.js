/**
 * Application-level constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CryptoVerseX';

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

export const VIEW_MODES = {
  TABLE: 'table',
  GRID: 'grid',
};

export const BOOKMARK_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'watchlist', label: 'Watchlist' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'research', label: 'Research' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nft', label: 'NFT' },
  { value: 'other', label: 'Other' },
];

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const DATE_RANGES = [
  { label: '7D',   value: '7' },
  { label: '30D',  value: '30' },
  { label: '90D',  value: '90' },
  { label: '180D', value: '180' },
  { label: '365D', value: '365' },
  { label: 'All',  value: 'all' },
];

export const TOAST_DURATION = 3000;

export const DEBOUNCE_DELAY = 400; // ms for search debounce
