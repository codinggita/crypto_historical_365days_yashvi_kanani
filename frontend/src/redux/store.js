import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coinReducer from './slices/coinSlice';
import analyticsReducer from './slices/analyticsSlice';
import watchlistReducer from './slices/watchlistSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    coins: coinReducer,
    analytics: analyticsReducer,
    watchlist: watchlistReducer,
    ui: uiReducer,
  },
});

export default store;
