import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWatchlistThunk,
  fetchWatchlistAnalyticsThunk,
  fetchTrendingBookmarksThunk,
  addToWatchlistThunk,
  removeFromWatchlistThunk,
  updateBookmarkThunk,
} from '../redux/thunks/watchlistThunks';
import {
  setFilters,
  resetFilters,
  setPage,
  setViewMode,
} from '../redux/slices/watchlistSlice';

/**
 * useWatchlist Hook
 */
export function useWatchlist() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.watchlist);

  const fetchWatchlist = useCallback(
    (params) => dispatch(fetchWatchlistThunk(params)),
    [dispatch]
  );

  const fetchWatchlistAnalytics = useCallback(
    () => dispatch(fetchWatchlistAnalyticsThunk()),
    [dispatch]
  );

  const fetchTrendingBookmarks = useCallback(
    (limit) => dispatch(fetchTrendingBookmarksThunk(limit)),
    [dispatch]
  );

  const addToWatchlist = useCallback(
    (coinId, coinData, meta) => dispatch(addToWatchlistThunk({ coinId, coinData, meta })),
    [dispatch]
  );

  const removeFromWatchlist = useCallback(
    (bookmarkId) => dispatch(removeFromWatchlistThunk(bookmarkId)),
    [dispatch]
  );

  const updateBookmark = useCallback(
    (id, data) => dispatch(updateBookmarkThunk({ id, data })),
    [dispatch]
  );

  const updateFilters = useCallback(
    (filters) => dispatch(setFilters(filters)),
    [dispatch]
  );

  const clearFilters = useCallback(
    () => dispatch(resetFilters()),
    [dispatch]
  );

  const changePage = useCallback(
    (page) => dispatch(setPage(page)),
    [dispatch]
  );

  const changeViewMode = useCallback(
    (mode) => dispatch(setViewMode(mode)),
    [dispatch]
  );

  return {
    ...state,
    fetchWatchlist,
    fetchWatchlistAnalytics,
    fetchTrendingBookmarks,
    addToWatchlist,
    removeFromWatchlist,
    updateBookmark,
    updateFilters,
    clearFilters,
    changePage,
    changeViewMode,
  };
}

export default useWatchlist;
