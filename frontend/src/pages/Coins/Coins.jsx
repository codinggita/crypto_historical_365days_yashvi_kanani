import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

function Coins() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cryptocurrencies</h1>
        <p className="page-subtitle">Real-time market price data, market capitalization, and volume tracking.</p>
      </div>
      <div className="shell-card">
        <span className="shell-card-icon" aria-hidden="true">
          <FiDollarSign />
        </span>
        <h3>Coins Market List</h3>
        <p style={{ marginTop: '0.5rem' }}>
          Live-updating coin listings, filtering, sorting, and full historical chart drill-downs are coming soon.
        </p>
      </div>
    </div>
  );
}

export default Coins;

