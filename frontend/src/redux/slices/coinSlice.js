import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coins: [],
  selectedCoin: null,
  loading: false,
  error: null,
};

const coinSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoins: (state, action) => {
      state.coins = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedCoin: (state, action) => {
      state.selectedCoin = action.payload;
      state.loading = false;
      state.error = null;
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

export const { setCoins, setSelectedCoin, setLoading, setError } = coinSlice.actions;
export default coinSlice.reducer;
