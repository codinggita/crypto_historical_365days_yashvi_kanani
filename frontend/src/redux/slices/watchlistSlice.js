import { createSlice } from '@reduxjs/toolkit';

const initialFilters = {
  category: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  minPrice: '',
  maxPrice: '',
  symbol: '',
};

const initialState = {
  bookmarks: [],
  bookmarkAnalytics: null,
  trendingBookmarks: [],
  loading: false,
  error: null,
  viewMode: 'table', // 'table' | 'grid'
  filters: initialFilters,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setBookmarks: (state, action) => {
      const { items, meta } = action.payload;
      state.bookmarks = items || [];
      if (meta) {
        state.pagination = { ...state.pagination, ...meta };
      }
      state.loading = false;
      state.error = null;
    },
    setAnalytics: (state, action) => {
      state.bookmarkAnalytics = action.payload;
      state.loading = false;
      state.error = null;
    },
    setTrending: (state, action) => {
      state.trendingBookmarks = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 on filter change
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    addBookmarkOptimistic: (state, action) => {
      const coin = action.payload;
      // Prevent duplicates by checking coin ID
      if (!state.bookmarks.some((b) => b.coin === coin.coin || b.coinId === coin.coinId)) {
        state.bookmarks.unshift({
          _id: coin._id || `temp-${Date.now()}`,
          coin: coin.coin || coin._id,
          coinName: coin.coinName || coin.name,
          symbol: coin.symbol,
          addedPrice: coin.addedPrice || coin.price || 0,
          currentPrice: coin.currentPrice || coin.price || 0,
          category: coin.category || 'watchlist',
          notes: coin.notes || '',
          createdAt: coin.createdAt || new Date().toISOString(),
          isOptimistic: true,
        });
        if (state.bookmarkAnalytics) {
          state.bookmarkAnalytics.totalBookmarked += 1;
        }
      }
    },
    removeBookmarkOptimistic: (state, action) => {
      const id = action.payload;
      state.bookmarks = state.bookmarks.filter(
        (b) => b._id !== id && b.coin !== id && b.coinId !== id
      );
      if (state.bookmarkAnalytics && state.bookmarkAnalytics.totalBookmarked > 0) {
        state.bookmarkAnalytics.totalBookmarked -= 1;
      }
    },
    updateBookmarkOptimistic: (state, action) => {
      const { id, category, notes } = action.payload;
      state.bookmarks = state.bookmarks.map((b) => {
        if (b._id === id || b.coin === id || b.coinId === id) {
          return {
            ...b,
            category: category !== undefined ? category : b.category,
            notes: notes !== undefined ? notes : b.notes,
          };
        }
        return b;
      });
    },
  },
});

export const {
  fetchStart,
  fetchFailure,
  setBookmarks,
  setAnalytics,
  setTrending,
  setFilters,
  resetFilters,
  setPage,
  setPagination,
  setViewMode,
  addBookmarkOptimistic,
  removeBookmarkOptimistic,
  updateBookmarkOptimistic,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
