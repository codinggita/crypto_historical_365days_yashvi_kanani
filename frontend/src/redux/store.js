import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coinReducer from './slices/coinSlice';
import coinDetailsReducer from './slices/coinDetailsSlice';
import analyticsReducer from './slices/analyticsSlice';
import watchlistReducer from './slices/watchlistSlice';
import statisticsReducer from './slices/statisticsSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    coins: coinReducer,
    coinDetails: coinDetailsReducer,
    analytics: analyticsReducer,
    watchlist: watchlistReducer,
    statistics: statisticsReducer,
    ui: uiReducer,
  },
});

export default store;
