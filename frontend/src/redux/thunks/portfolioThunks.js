import { createAsyncThunk } from '@reduxjs/toolkit';
import { portfolioService } from '../../services/portfolio.service';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addHoldingSuccess,
  updateHoldingSuccess,
  deleteHoldingSuccess,
  setSimulationResults,
} from '../slices/portfolioSlice';

// Fetch portfolio overview + holdings
export const fetchPortfolioThunk = createAsyncThunk(
  'portfolio/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const [overviewRes, holdingsRes, recsRes] = await Promise.allSettled([
        portfolioService.getPortfolioOverview(),
        portfolioService.getPortfolios(),
        portfolioService.getRecommendations(),
      ]);

      const ok = (r) => (r.status === 'fulfilled' ? r.value?.data || r.value : null);

      const portfolio      = ok(overviewRes);
      const holdingsRaw    = ok(holdingsRes);
      const recommendations= ok(recsRes);

      const holdings = holdingsRaw?.holdings || holdingsRaw?.items ||
                       (Array.isArray(holdingsRaw) ? holdingsRaw : []);

      const recsArr = recommendations?.recommendations ||
                      (Array.isArray(recommendations) ? recommendations : []);

      const payload = { portfolio, holdings, recommendations: recsArr };
      dispatch(fetchSuccess(payload));
      return payload;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch portfolio';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Add portfolio holding
export const addHoldingThunk = createAsyncThunk(
  'portfolio/addHolding',
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const res     = await portfolioService.addPortfolioItem(data);
      const holding = res?.data?.holding || res?.data || res;
      dispatch(addHoldingSuccess(holding));
      return holding;
    } catch (err) {
      const msg = err?.message || 'Failed to add holding';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Update portfolio holding
export const updateHoldingThunk = createAsyncThunk(
  'portfolio/updateHolding',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const res     = await portfolioService.updatePortfolioItem(id, data);
      const holding = res?.data?.holding || res?.data || res;
      dispatch(updateHoldingSuccess(holding));
      return holding;
    } catch (err) {
      const msg = err?.message || 'Failed to update holding';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Delete portfolio holding
export const deleteHoldingThunk = createAsyncThunk(
  'portfolio/deleteHolding',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      await portfolioService.deletePortfolioItem(id);
      dispatch(deleteHoldingSuccess(id));
      return id;
    } catch (err) {
      const msg = err?.message || 'Failed to delete holding';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Simulate portfolio
export const simulatePortfolioThunk = createAsyncThunk(
  'portfolio/simulate',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data    = await portfolioService.simulatePortfolio(params);
      const results = data?.data || data;
      dispatch(setSimulationResults(results));
      return results;
    } catch (err) {
      const msg = err?.message || 'Simulation failed';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);
