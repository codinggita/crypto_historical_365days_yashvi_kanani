import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coinDetails: null,
  history: [],
  performance: null,
  returns: null,
  volatility: null,
  loading: false,
  error: null,
  selectedRange: '30', // '7' | '30' | '90' | '180' | '365' | 'all'
  chartMode: 'price',  // 'price' | 'marketCap' | 'volume'
  chartType: 'area',   // 'area' | 'line'
};

const coinDetailsSlice = createSlice({
  name: 'coinDetails',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      const { coinDetails, history, performance, returns, volatility } = action.payload;
      if (coinDetails !== undefined) state.coinDetails = coinDetails;
      if (history !== undefined) state.history = history;
      if (performance !== undefined) state.performance = performance;
      if (returns !== undefined) state.returns = returns;
      if (volatility !== undefined) state.volatility = volatility;
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
    setChartMode: (state, action) => {
      state.chartMode = action.payload;
    },
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    resetDetailsState: (state) => {
      return initialState;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  setSelectedRange,
  setChartMode,
  setChartType,
  resetDetailsState,
} = coinDetailsSlice.actions;

export default coinDetailsSlice.reducer;
