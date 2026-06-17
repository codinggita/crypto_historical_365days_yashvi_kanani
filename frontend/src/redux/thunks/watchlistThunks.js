import { createAsyncThunk } from '@reduxjs/toolkit';
import { watchlistService } from '../../services/watchlist.service';
import {
  fetchStart,
  fetchFailure,
  setBookmarks,
  setAnalytics,
  setTrending,
  addBookmarkOptimistic,
  removeBookmarkOptimistic,
  updateBookmarkOptimistic,
} from '../slices/watchlistSlice';

// Fetch watchlist
export const fetchWatchlistThunk = createAsyncThunk(
  'watchlist/fetch',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data = await watchlistService.getWatchlist(params);
      const items = data?.data?.bookmarks || data?.data?.items ||
                    (Array.isArray(data?.data) ? data.data : []);
      const meta  = data?.data?.pagination || data?.pagination || {};
      dispatch(setBookmarks({ items, meta }));
      return { items, meta };
    } catch (err) {
      const msg = err?.message || 'Failed to fetch watchlist';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch watchlist analytics
export const fetchWatchlistAnalyticsThunk = createAsyncThunk(
  'watchlist/fetchAnalytics',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data      = await watchlistService.getBookmarkAnalytics();
      const analytics = data?.data || data;
      dispatch(setAnalytics(analytics));
      return analytics;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch analytics');
    }
  }
);

// Fetch trending bookmarks
export const fetchTrendingBookmarksThunk = createAsyncThunk(
  'watchlist/fetchTrending',
  async (limit = 10, { dispatch, rejectWithValue }) => {
    try {
      const data     = await watchlistService.getTrendingBookmarks(limit);
      const trending = data?.data?.trending ||
                       (Array.isArray(data?.data) ? data.data : []);
      dispatch(setTrending(trending));
      return trending;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch trending');
    }
  }
);

// Add to watchlist
export const addToWatchlistThunk = createAsyncThunk(
  'watchlist/add',
  async ({ coinId, coinData, meta = {} }, { dispatch, rejectWithValue }) => {
    // Optimistic update
    dispatch(addBookmarkOptimistic({ ...coinData, coin: coinId }));
    try {
      const data     = await watchlistService.addToWatchlist(coinId, meta);
      const bookmark = data?.data?.bookmark || data?.data || data;
      return bookmark;
    } catch (err) {
      // Rollback optimistic
      dispatch(removeBookmarkOptimistic(coinId));
      return rejectWithValue(err?.message || 'Failed to add to watchlist');
    }
  }
);

// Remove from watchlist
export const removeFromWatchlistThunk = createAsyncThunk(
  'watchlist/remove',
  async (bookmarkId, { dispatch, rejectWithValue }) => {
    dispatch(removeBookmarkOptimistic(bookmarkId));
    try {
      await watchlistService.removeFromWatchlist(bookmarkId);
      return bookmarkId;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to remove from watchlist');
    }
  }
);

// Update bookmark (category/notes)
export const updateBookmarkThunk = createAsyncThunk(
  'watchlist/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    dispatch(updateBookmarkOptimistic({ id, ...data }));
    try {
      const res      = await watchlistService.updateBookmark(id, data);
      const bookmark = res?.data?.bookmark || res?.data || res;
      return bookmark;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to update bookmark');
    }
  }
);
