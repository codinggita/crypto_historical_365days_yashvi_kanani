import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  analyticsData: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action) => {
      state.analyticsData = action.payload;
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

export const { setAnalyticsData, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
