import { createAsyncThunk } from '@reduxjs/toolkit';
import coinService from '../../services/coin.service';
import {
  setCoins,
  setSelectedCoin,
  setLoading,
  setError,
  setMarketSummary,
  setMarketSummaryLoading,
  setMarketSummaryError,
  setTopGainers,
  setTopLosers,
} from '../slices/coinSlice';

// Fetch paginated/filtered coin list
export const fetchCoinsThunk = createAsyncThunk(
  'coins/fetchCoins',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const data   = await coinService.getCoins(params);
      const rawData = data?.data || data;

      // Support new shape: { coins, pagination } and legacy shape
      const coins = Array.isArray(rawData)
        ? rawData
        : rawData?.coins ?? rawData?.data?.coins ?? [];

      const paginationObj = rawData?.pagination ?? rawData?.data?.pagination;

      const pagination = paginationObj
        ? {
            page:        paginationObj.page        ?? params?.page  ?? 1,
            limit:       paginationObj.limit        ?? params?.limit ?? 10,
            total:       paginationObj.totalItems   ?? paginationObj.total ?? coins.length,
            totalPages:  paginationObj.totalPages   ?? 1,
            hasNextPage: paginationObj.hasNextPage  ?? false,
            hasPrevPage: paginationObj.hasPrevPage  ?? false,
          }
        : Array.isArray(rawData)
          ? { page: 1, limit: params?.limit ?? 10, total: rawData.length, totalPages: 1, hasNextPage: false, hasPrevPage: false }
          : {
              page:        rawData?.page        ?? rawData?.currentPage ?? 1,
              limit:       rawData?.limit       ?? params?.limit        ?? 10,
              total:       rawData?.totalCoins  ?? rawData?.total       ?? coins.length,
              totalPages:  rawData?.totalPages  ?? 1,
              hasNextPage: false,
              hasPrevPage: false,
            };

      dispatch(setCoins({ data: coins, pagination }));
      return { coins, pagination };
    } catch (err) {
      const msg = err?.message || 'Failed to fetch coins';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);


// Fetch single coin by ID
export const fetchCoinByIdThunk = createAsyncThunk(
  'coins/fetchById',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const data = await coinService.getCoinById(id);
      const coin = data?.data?.coin || data?.data || data;
      dispatch(setSelectedCoin(coin));
      return coin;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch coin details';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch market summary
export const fetchMarketSummaryThunk = createAsyncThunk(
  'coins/fetchMarketSummary',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setMarketSummaryLoading(true));
    try {
      const data    = await coinService.getMarketSummary();
      const summary = data?.data || data;
      dispatch(setMarketSummary(summary));
      return summary;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch market summary';
      dispatch(setMarketSummaryError(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch top gainers
export const fetchTopGainersThunk = createAsyncThunk(
  'coins/fetchTopGainers',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const data    = await coinService.getTopGainers(params);
      const gainers = data?.data?.coins || data?.data || data?.coins || data || [];
      dispatch(setTopGainers(gainers));
      return gainers;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch top gainers');
    }
  }
);

// Fetch top losers
export const fetchTopLosersThunk = createAsyncThunk(
  'coins/fetchTopLosers',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const data   = await coinService.getTopLosers(params);
      const losers = data?.data?.coins || data?.data || data?.coins || data || [];
      dispatch(setTopLosers(losers));
      return losers;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch top losers');
    }
  }
);

// Fetch trending coins
export const fetchTrendingCoinsThunk = createAsyncThunk(
  'coins/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const data  = await coinService.getTrendingCoins();
      return data?.data?.coins || data?.data || data?.coins || data || [];
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch trending coins');
    }
  }
);
