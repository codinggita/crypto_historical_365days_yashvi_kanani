import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  overview: null,
  users: {
    list: [],
    meta: null,
  },
  logs: {
    list: [],
    meta: null,
  },
  analytics: {
    watchlist: null,
    portfolio: null,
    search: null,
    coins: null,
  },
  health: null,
  loading: false,
  error: null,
  activeSection: 'overview',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      const { overview, users, logs, analytics, health } = action.payload;
      if (overview !== undefined) state.overview = overview;
      if (users !== undefined) state.users = { ...state.users, ...users };
      if (logs !== undefined) state.logs = { ...state.logs, ...logs };
      if (analytics !== undefined)
        state.analytics = { ...state.analytics, ...analytics };
      if (health !== undefined) state.health = health;
      state.loading = false;
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    resetAdminState: () => initialState,
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  setActiveSection,
  resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;
