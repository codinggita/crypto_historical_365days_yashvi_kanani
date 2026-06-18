import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coins: [],
  selectedCoin: null,
  loading: false,
  error: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  // Filters
  filters: {
    search: '',
    sortBy: 'rank',
    sortOrder: 'asc',
    minPrice: '',
    maxPrice: '',
    minVolume: '',
    maxVolume: '',
    minMarketCap: '',
    maxMarketCap: '',
    symbol: '',
    month: '',
  },

  // View mode
  viewMode: 'table', // 'table' | 'grid'

  // Market summary
  marketSummary: null,
  marketSummaryLoading: false,
  marketSummaryError: null,

  // Top data
  topGainers: [],
  topLosers: [],
};

const coinSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoins: (state, action) => {
      const { data, pagination } = action.payload;
      state.coins = Array.isArray(data) ? data : Array.isArray(action.payload) ? action.payload : [];
      if (pagination) {
        state.pagination = {
          ...state.pagination,
          page:        pagination.page        ?? state.pagination.page,
          limit:       pagination.limit       ?? state.pagination.limit,
          total:       pagination.total       ?? pagination.totalItems ?? 0,
          totalPages:  pagination.totalPages  ?? 0,
          hasNextPage: pagination.hasNextPage ?? false,
          hasPrevPage: pagination.hasPrevPage ?? false,
        };
      }
      state.loading = false;
      state.error = null;
    },
    setSelectedCoin: (state, action) => {
      state.selectedCoin = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    // KEY FIX: setLimit resets page to 1 AND updates pagination.limit
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page  = 1;
    },
    setFilters: (state, action) => {
      // If limit is in the payload route it to pagination, not filters
      const { limit, ...rest } = action.payload;
      if (limit !== undefined) {
        state.pagination.limit = Number(limit);
        state.pagination.page  = 1;
      }
      state.filters = { ...state.filters, ...rest };
      // Any other filter change also resets to page 1
      if (Object.keys(rest).length > 0) {
        state.pagination.page = 1;
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setMarketSummary: (state, action) => {
      state.marketSummary = action.payload;
      state.marketSummaryLoading = false;
      state.marketSummaryError = null;
    },
    setMarketSummaryLoading: (state, action) => {
      state.marketSummaryLoading = action.payload;
    },
    setMarketSummaryError: (state, action) => {
      state.marketSummaryError = action.payload;
      state.marketSummaryLoading = false;
    },
    setTopGainers: (state, action) => {
      state.topGainers = Array.isArray(action.payload) ? action.payload : [];
    },
    setTopLosers: (state, action) => {
      state.topLosers = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const {
  setCoins,
  setSelectedCoin,
  setLoading,
  setError,
  setPagination,
  setPage,
  setLimit,
  setFilters,
  resetFilters,
  setViewMode,
  setMarketSummary,
  setMarketSummaryLoading,
  setMarketSummaryError,
  setTopGainers,
  setTopLosers,
} = coinSlice.actions;

export default coinSlice.reducer;
