import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  fetchProfileThunk,
  updateProfileThunk,
  changePasswordThunk,
} from '../redux/thunks/authThunks';

/**
 * useAuth Hook
 * Consolidates auth state and dispatch functions.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    (credentials) => dispatch(loginThunk(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerThunk(userData)),
    [dispatch]
  );

  const logout = useCallback(
    () => dispatch(logoutThunk()),
    [dispatch]
  );

  const fetchProfile = useCallback(
    () => dispatch(fetchProfileThunk()),
    [dispatch]
  );

  const updateProfile = useCallback(
    (profileData) => dispatch(updateProfileThunk(profileData)),
    [dispatch]
  );

  const changePassword = useCallback(
    (passwordData) => dispatch(changePasswordThunk(passwordData)),
    [dispatch]
  );

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
  };
}

export default useAuth;
