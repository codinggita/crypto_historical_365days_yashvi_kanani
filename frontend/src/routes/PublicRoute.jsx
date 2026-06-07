import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PublicRoute Wrapper
 * Prepares architecture for future authentication flow.
 * Ensures authenticated users are redirected away from login/register pages (e.g. to /dashboard).
 */
function PublicRoute({ children }) {
  // Temporary: Always false to allow access for now
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
