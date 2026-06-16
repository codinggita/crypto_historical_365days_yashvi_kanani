import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import Coins from '../pages/Coins/Coins';
import CoinDetails from '../pages/CoinDetails/CoinDetails';
import Analytics from '../pages/Analytics/Analytics';
import Stats from '../pages/Stats/Stats';
import Watchlist from '../pages/Watchlist/Watchlist';
import Portfolio from '../pages/Portfolio/Portfolio';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound/NotFound';

// Route Wrappers
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

function AppRoutes() {
  return (
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
          path="/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Stats />
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

        {/* 404 Pages */}
        <Route path="/not-found" element={<NotFound />} />
      </Route>

      {/* Catch-all Redirect to NotFound */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default AppRoutes;
