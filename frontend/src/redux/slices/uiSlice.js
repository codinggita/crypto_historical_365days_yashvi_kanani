import { createSlice } from '@reduxjs/toolkit';

// Restore persisted theme from localStorage (default: dark)
const persistedTheme = localStorage.getItem('theme') || 'dark';

const initialState = {
  sidebarOpen: false,
  theme: persistedTheme,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, changeTheme } = uiSlice.actions;
export default uiSlice.reducer;
