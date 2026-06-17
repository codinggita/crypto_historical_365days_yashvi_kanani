import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCoinsThunk,
  fetchCoinByIdThunk,
  fetchMarketSummaryThunk,
  fetchTopGainersThunk,
  fetchTopLosersThunk,
  fetchTrendingCoinsThunk,
} from '../redux/thunks/coinThunks';
import {
  setFilters,
  resetFilters,
  setPage,
  setViewMode,
} from '../redux/slices/coinSlice';

/**
 * useCoins Hook
 * Exposes coin listings, filters, details, and market summary logic.
 */
export function useCoins() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.coins);

  const fetchCoins = useCallback(
    (params) => dispatch(fetchCoinsThunk(params)),
    [dispatch]
  );

  const fetchCoinById = useCallback(
    (id) => dispatch(fetchCoinByIdThunk(id)),
    [dispatch]
  );

  const fetchMarketSummary = useCallback(
    () => dispatch(fetchMarketSummaryThunk()),
    [dispatch]
  );

  const fetchTopGainers = useCallback(
    (params) => dispatch(fetchTopGainersThunk(params)),
    [dispatch]
  );

  const fetchTopLosers = useCallback(
    (params) => dispatch(fetchTopLosersThunk(params)),
    [dispatch]
  );

  const fetchTrendingCoins = useCallback(
    () => dispatch(fetchTrendingCoinsThunk()),
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
    fetchCoins,
    fetchCoinById,
    fetchMarketSummary,
    fetchTopGainers,
    fetchTopLosers,
    fetchTrendingCoins,
    updateFilters,
    clearFilters,
    changePage,
    changeViewMode,
  };
}

export default useCoins;
