import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  marketStats: null,
  monthlyStats: null,
  yearlyStats: null,
  distributionStats: null,
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      const { marketStats, monthlyStats, yearlyStats, distributionStats } = action.payload;
      if (marketStats !== undefined) state.marketStats = marketStats;
      if (monthlyStats !== undefined) state.monthlyStats = monthlyStats;
      if (yearlyStats !== undefined) state.yearlyStats = yearlyStats;
      if (distributionStats !== undefined) state.distributionStats = distributionStats;
      state.loading = false;
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetStatisticsState: (state) => {
      return initialState;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  resetStatisticsState,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
