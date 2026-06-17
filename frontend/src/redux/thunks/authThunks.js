import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';
import { setUser, logout as logoutAction, setLoading, setError } from '../slices/authSlice';

// Login thunk
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.login(credentials);
      const token = data?.data?.token || data?.token;
      const user  = data?.data?.user  || data?.user  || data?.data;
      if (token) localStorage.setItem('token', token);
      dispatch(setUser({ user, token }));
      return { user, token };
    } catch (err) {
      const msg = err?.message || 'Login failed';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// Register thunk
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.register(userData);
      const token = data?.data?.token || data?.token;
      const user  = data?.data?.user  || data?.user  || data?.data;
      if (token) localStorage.setItem('token', token);
      dispatch(setUser({ user, token }));
      return { user, token };
    } catch (err) {
      const msg = err?.message || 'Registration failed';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// Logout thunk
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try { await authService.logout(); } catch (_) {}
    localStorage.removeItem('token');
    dispatch(logoutAction());
  }
);

// Fetch profile thunk
export const fetchProfileThunk = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.getProfile();
      const user  = data?.data?.user || data?.data || data;
      const token = localStorage.getItem('token');
      dispatch(setUser({ user, token }));
      return user;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch profile';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// Update profile thunk
export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.updateProfile(profileData);
      const user  = data?.data?.user || data?.data || data;
      const token = localStorage.getItem('token');
      dispatch(setUser({ user, token }));
      return user;
    } catch (err) {
      const msg = err?.message || 'Profile update failed';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

// Change password thunk
export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.changePassword(passwordData);
      dispatch(setLoading(false));
      return data;
    } catch (err) {
      const msg = err?.message || 'Password change failed';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);
