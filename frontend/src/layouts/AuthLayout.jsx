import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Hexagon } from 'lucide-react';
import '../styles/auth.css';

function AuthLayout() {
  return (
    <div className="auth-container">
      {/* Left Visual Panel - Desktop Only */}
      <div className="auth-visual-panel">
        <Link to="/" className="auth-logo">
          <motion.div 
            className="auth-logo-icon"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Hexagon size={20} />
          </motion.div>
          <span className="title-gradient">CryptoVerseX</span>
        </Link>

        <div className="auth-visual-body">
          <motion.h1 
            className="auth-visual-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Advanced Market Intelligence at Your Fingertips.
          </motion.h1>
          <motion.p 
            className="auth-visual-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Access real-time intelligence, historical statistics, custom watchlists, and optimized MongoDB aggregation pipelines in a unified, state-of-the-art crypto dashboard.
          </motion.p>

          {/* Floating Stats Card Mockup */}
          <motion.div 
            className="auth-stats-widget"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <div className="auth-stats-header">
              <span className="auth-stats-title">GLOBAL MARKET CAP</span>
              <span className="auth-stats-badge">
                <TrendingUp size={12} style={{ marginRight: '4px', display: 'inline' }} /> +4.2%
              </span>
            </div>
            <div className="auth-stats-value">$2.48 Trillion</div>
          </motion.div>
        </div>

        <div className="auth-visual-footer">
          &copy; {new Date().getFullYear()} CryptoVerseX. All rights reserved.
        </div>
      </div>

      {/* Right Content Panel - Auth Forms */}
      <div className="auth-content-panel">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
