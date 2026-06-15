import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  analyticsData: null,
  marketSummary: null,
  topGainers: [],
  topLosers: [],
  loading: false,
  error: null,
  selectedRange: '30', // '7' | '30' | '90' | '180' | '365' | 'all'
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      const { analyticsData, marketSummary, topGainers, topLosers } = action.payload;
      if (analyticsData !== undefined) state.analyticsData = analyticsData;
      if (marketSummary !== undefined) state.marketSummary = marketSummary;
      if (topGainers !== undefined) state.topGainers = topGainers;
      if (topLosers !== undefined) state.topLosers = topLosers;
      state.loading = false;
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedRange: (state, action) => {
      state.selectedRange = action.payload;
    },
    resetAnalyticsState: (state) => {
      return initialState;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  setSelectedRange,
  resetAnalyticsState,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

