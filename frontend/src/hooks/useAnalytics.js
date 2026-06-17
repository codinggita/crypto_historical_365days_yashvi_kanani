import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMarketAnalyticsThunk,
  fetchVolumeAnalyticsThunk,
  fetchVolatilityAnalyticsThunk,
  fetchReturnsAnalyticsThunk,
} from '../redux/thunks/analyticsThunks';
import { setSelectedRange, resetAnalyticsState } from '../redux/slices/analyticsSlice';

/**
 * useAnalytics Hook
 */
export function useAnalytics() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.analytics);

  const fetchMarketAnalytics = useCallback(
    () => dispatch(fetchMarketAnalyticsThunk()),
    [dispatch]
  );

  const fetchVolumeAnalytics = useCallback(
    () => dispatch(fetchVolumeAnalyticsThunk()),
    [dispatch]
  );

  const fetchVolatilityAnalytics = useCallback(
    () => dispatch(fetchVolatilityAnalyticsThunk()),
    [dispatch]
  );

  const fetchReturnsAnalytics = useCallback(
    () => dispatch(fetchReturnsAnalyticsThunk()),
    [dispatch]
  );

  const changeSelectedRange = useCallback(
    (range) => dispatch(setSelectedRange(range)),
    [dispatch]
  );

  const clearAnalyticsState = useCallback(
    () => dispatch(resetAnalyticsState()),
    [dispatch]
  );

  return {
    ...state,
    fetchMarketAnalytics,
    fetchVolumeAnalytics,
    fetchVolatilityAnalytics,
    fetchReturnsAnalytics,
    changeSelectedRange,
    clearAnalyticsState,
  };
}

export default useAnalytics;
