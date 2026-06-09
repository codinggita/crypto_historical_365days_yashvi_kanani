import React from 'react';
import { FiBookmark } from 'react-icons/fi';

function Watchlist() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Watchlist</h1>
        <p className="page-subtitle">Monitor and track your favorite cryptocurrency assets in one dashboard.</p>
      </div>
      <div className="shell-card">
        <span className="shell-card-icon" aria-hidden="true">
          <FiBookmark />
        </span>
        <h3>Asset Watchlist</h3>
        <p style={{ marginTop: '0.5rem' }}>
          Custom watchlists, custom price alerts, and performance metrics for your saved coins are coming soon.
        </p>
      </div>
    </div>
  );
}

export default Watchlist;

