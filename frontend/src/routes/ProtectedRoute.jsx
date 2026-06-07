import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Wrapper
 * Temporary behavior: Always allows access.
 * Prepares architecture for future JWT & Redux authentication check.
 */
function ProtectedRoute({ children }) {
  // Temporary: Always true
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
