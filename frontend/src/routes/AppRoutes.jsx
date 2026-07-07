import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

import RouteFallback from '../components/common/RouteFallback';

// Pages via Lazy Loading
const Home = lazy(() => import('../pages/Home/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Coins = lazy(() => import('../pages/Coins/Coins'));
const CoinDetails = lazy(() => import('../pages/CoinDetails/CoinDetails'));
const Analytics = lazy(() => import('../pages/Analytics/Analytics'));
const Watchlist = lazy(() => import('../pages/Watchlist/Watchlist'));
const Portfolio = lazy(() => import('../pages/Portfolio/Portfolio'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const Admin = lazy(() => import('../pages/Admin/Admin'));

// Route Wrappers
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Auth Layout / Public Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>

        {/* Main Layout / Routes */}
        <Route element={<MainLayout />}>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Protected Dashboard/App Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coins"
            element={
              <ProtectedRoute>
                <Coins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coins/:id"
            element={
              <ProtectedRoute>
                <CoinDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 404 Pages */}
          <Route path="/not-found" element={<NotFound />} />
        </Route>

        {/* Catch-all Redirect to NotFound */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
