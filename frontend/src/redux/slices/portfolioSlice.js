import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  portfolio: null, // Overview totals (totalInvested, totalCurrentValue, totalProfitLoss, profitLossPercentage, bestPerformingCoin, worstPerformingCoin)
  holdings: [], // List of user's holdings transactions
  simulationResults: null, // Results from calculator/simulator calculations
  recommendations: [], // Recommended coins array
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      const { portfolio, holdings, recommendations } = action.payload;
      if (portfolio !== undefined) state.portfolio = portfolio;
      if (holdings !== undefined) state.holdings = holdings;
      if (recommendations !== undefined) state.recommendations = recommendations;
      state.loading = false;
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setHoldings: (state, action) => {
      state.holdings = action.payload;
    },
    addHoldingSuccess: (state, action) => {
      state.holdings.unshift(action.payload);
    },
    updateHoldingSuccess: (state, action) => {
      state.holdings = state.holdings.map((h) => 
        h._id === action.payload._id ? action.payload : h
      );
    },
    deleteHoldingSuccess: (state, action) => {
      state.holdings = state.holdings.filter((h) => h._id !== action.payload);
    },
    setSimulationResults: (state, action) => {
      state.simulationResults = action.payload;
      state.loading = false;
    },
    resetPortfolioState: (state) => {
      return initialState;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  setHoldings,
  addHoldingSuccess,
  updateHoldingSuccess,
  deleteHoldingSuccess,
  setSimulationResults,
  resetPortfolioState,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
