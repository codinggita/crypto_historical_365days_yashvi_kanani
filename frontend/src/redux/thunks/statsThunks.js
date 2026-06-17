import { createAsyncThunk } from '@reduxjs/toolkit';
import { statsService } from '../../services/stats.service';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
} from '../slices/statisticsSlice';

// Fetch all statistics data
export const fetchStatisticsThunk = createAsyncThunk(
  'statistics/fetchAll',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const [summaryRes, monthlyRes, yearlyRes, distRes] = await Promise.allSettled([
        statsService.getMarketSummary(),
        statsService.getMonthlyAnalysis(),
        statsService.getYearlyAnalysis(),
        statsService.getPriceDistribution(),
      ]);

      const ok = (r) => (r.status === 'fulfilled' ? r.value?.data || r.value : null);

      const payload = {
        marketStats:      ok(summaryRes),
        monthlyStats:     ok(monthlyRes),
        yearlyStats:      ok(yearlyRes),
        distributionStats:ok(distRes),
      };
      dispatch(fetchSuccess(payload));
      return payload;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch statistics';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch market summary only
export const fetchMarketStatsThunk = createAsyncThunk(
  'statistics/fetchMarketStats',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data        = await statsService.getMarketSummary();
      const marketStats = data?.data || data;
      dispatch(fetchSuccess({ marketStats }));
      return marketStats;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch market stats';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch top gainers
export const fetchStatTopGainersThunk = createAsyncThunk(
  'statistics/fetchTopGainers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await statsService.getTopGainers(params);
      return data?.data?.coins || data?.data || data?.coins || [];
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch top gainers');
    }
  }
);

// Fetch top losers
export const fetchStatTopLosersThunk = createAsyncThunk(
  'statistics/fetchTopLosers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await statsService.getTopLosers(params);
      return data?.data?.coins || data?.data || data?.coins || [];
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch top losers');
    }
  }
);
