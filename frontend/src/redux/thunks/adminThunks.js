import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/admin.service';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
} from '../slices/adminSlice';

// Fetch admin overview stats
export const fetchAdminOverviewThunk = createAsyncThunk(
  'admin/fetchOverview',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data     = await adminService.getStats();
      const overview = data?.data || data;
      dispatch(fetchSuccess({ overview }));
      return overview;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch admin overview';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch admin users list
export const fetchAdminUsersThunk = createAsyncThunk(
  'admin/fetchUsers',
  async (params = {}, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data  = await adminService.getUsers(params);
      const list  = data?.data?.users  || data?.data || data?.users || [];
      const meta  = data?.data?.pagination || data?.pagination || {};
      dispatch(fetchSuccess({ users: { list, meta } }));
      return { list, meta };
    } catch (err) {
      const msg = err?.message || 'Failed to fetch users';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch admin activity logs
export const fetchAdminLogsThunk = createAsyncThunk(
  'admin/fetchLogs',
  async (params = {}, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const data = await adminService.getLogs(params);
      const list = data?.data?.logs || data?.data || data?.logs || [];
      const meta = data?.data?.pagination || data?.pagination || {};
      dispatch(fetchSuccess({ logs: { list, meta } }));
      return { list, meta };
    } catch (err) {
      const msg = err?.message || 'Failed to fetch logs';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Fetch all admin analytics
export const fetchAdminAnalyticsThunk = createAsyncThunk(
  'admin/fetchAnalytics',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(fetchStart());
    try {
      const [watchlistRes, portfolioRes, searchRes] = await Promise.allSettled([
        adminService.getWatchlistAnalytics(),
        adminService.getPortfolioAnalytics(),
        adminService.getSearchAnalytics(),
      ]);

      const ok = (r) => (r.status === 'fulfilled' ? r.value?.data || r.value : null);

      const analytics = {
        watchlist: ok(watchlistRes),
        portfolio: ok(portfolioRes),
        search:    ok(searchRes),
      };
      dispatch(fetchSuccess({ analytics }));
      return analytics;
    } catch (err) {
      const msg = err?.message || 'Failed to fetch admin analytics';
      dispatch(fetchFailure(msg));
      return rejectWithValue(msg);
    }
  }
);

// Update user role
export const updateUserRoleThunk = createAsyncThunk(
  'admin/updateUserRole',
  async ({ id, role }, { dispatch, rejectWithValue }) => {
    try {
      const data = await adminService.updateUserRole(id, role);
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to update user role');
    }
  }
);

// Update user status (active/inactive)
export const updateUserStatusThunk = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ id, isActive }, { dispatch, rejectWithValue }) => {
    try {
      const data = await adminService.updateUserStatus(id, isActive);
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to update user status');
    }
  }
);

// Delete user
export const deleteUserThunk = createAsyncThunk(
  'admin/deleteUser',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await adminService.deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to delete user');
    }
  }
);
