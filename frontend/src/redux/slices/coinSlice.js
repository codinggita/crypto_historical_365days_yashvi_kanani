import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coins: [],
  selectedCoin: null,
  loading: false,
  error: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
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
      state.coins = data || action.payload;
      if (pagination) state.pagination = { ...state.pagination, ...pagination };
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // reset to page 1 on filter change
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
      state.topGainers = action.payload;
    },
    setTopLosers: (state, action) => {
      state.topLosers = action.payload;
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
