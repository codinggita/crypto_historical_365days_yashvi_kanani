import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiTrendingUp, FiLayers } from 'react-icons/fi';
import '../styles/auth.css';

function AuthLayout() {
  return (
    <div className="auth-container">
      {/* Left Visual Panel - Desktop Only */}
      <div className="auth-visual-panel">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">
            <FiLayers size={20} />
          </div>
          <span>CryptoVerseX</span>
        </Link>

        <div className="auth-visual-body">
          <h1 className="auth-visual-title">
            Advanced Market Intelligence at Your Fingertips.
          </h1>
          <p className="auth-visual-description">
            Access real-time intelligence, historical statistics, custom watchlists, and optimized MongoDB aggregation pipelines in a unified, state-of-the-art crypto dashboard.
          </p>

          {/* Floating Stats Card Mockup */}
          <div className="auth-stats-widget">
            <div className="auth-stats-header">
              <span className="auth-stats-title">GLOBAL MARKET CAP</span>
              <span className="auth-stats-badge">
                <FiTrendingUp style={{ marginRight: '4px', display: 'inline' }} /> +4.2%
              </span>
            </div>
            <div className="auth-stats-value">$2.48 Trillion</div>
          </div>
        </div>

        <div className="auth-visual-footer">
          &copy; {new Date().getFullYear()} CryptoVerseX. All rights reserved.
        </div>
      </div>

      {/* Right Content Panel - Auth Forms */}
      <div className="auth-content-panel">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
