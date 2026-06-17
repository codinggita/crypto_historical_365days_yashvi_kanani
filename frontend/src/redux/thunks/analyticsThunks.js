import { createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analytics.service';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
} from '../slices/analyticsSlice';

// Fetch market analytics overview
export const fetchMarketAnalyticsThunk = createAsyncThunk(
  'analytics/fetchMarketAnalytics',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const [summaryRes, gainersRes, losersRes] = await Promise.allSettled([
        analyticsService.getStatsMarketSummary(),
        analyticsService.getStatsTopGainers({ limit: 10 }),
        analyticsService.getStatsTopLosers({ limit: 10 }),
      ]);

      const ok   = (r) => (r.status === 'fulfilled' ? r.value?.data || r.value : null);
      const list = (r, key) => {
        const d = ok(r);
        return d?.[key] || d?.coins || (Array.isArray(d) ? d : []);
      };

      const payload = {
        marketSummary: ok(summaryRes),
        topGainers:    list(gainersRes, 'coins'),
        topLosers:     list(losersRes,  'coins'),
      };
      dispatch(fetchSuccess(payload));
      return payload;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch analytics';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch volume analytics
export const fetchVolumeAnalyticsThunk = createAsyncThunk(
  'analytics/fetchVolume',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data = await analyticsService.getHighestVolume();
      const analyticsData = data?.data || data;
      dispatch(fetchSuccess({ analyticsData }));
      return analyticsData;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch volume analytics';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch volatility analytics
export const fetchVolatilityAnalyticsThunk = createAsyncThunk(
  'analytics/fetchVolatility',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data = await analyticsService.getHighVolatility();
      const analyticsData = data?.data || data;
      dispatch(fetchSuccess({ analyticsData }));
      return analyticsData;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch volatility analytics';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch returns analytics
export const fetchReturnsAnalyticsThunk = createAsyncThunk(
  'analytics/fetchReturns',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data = await analyticsService.getTopReturns();
      const analyticsData = data?.data || data;
      dispatch(fetchSuccess({ analyticsData }));
      return analyticsData;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch returns analytics';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);
