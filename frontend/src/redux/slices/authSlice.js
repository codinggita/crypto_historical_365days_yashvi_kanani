import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

function getInitialAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    }

    return {
      user: {
        _id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  } catch {
    localStorage.removeItem('token');
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuth(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
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

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
