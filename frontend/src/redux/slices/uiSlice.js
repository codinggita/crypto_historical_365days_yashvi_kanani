import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, changeTheme } = uiSlice.actions;
export default uiSlice.reducer;
