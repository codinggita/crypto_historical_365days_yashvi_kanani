import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  watchlist: [],
  loading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      if (!state.watchlist.some((coin) => coin.id === action.payload.id)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter((coin) => coin.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, setLoading, setError } = watchlistSlice.actions;
export default watchlistSlice.reducer;
