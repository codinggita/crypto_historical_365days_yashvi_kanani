import React from 'react';
import { FiPieChart } from 'react-icons/fi';

function Stats() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Historical Statistics</h1>
        <p className="page-subtitle">Compare multi-year historical market performances and metrics.</p>
      </div>
      <div className="shell-card">
        <span className="shell-card-icon" aria-hidden="true">
          <FiPieChart />
        </span>
        <h3>Historical Performance Stats</h3>
        <p style={{ marginTop: '0.5rem' }}>
          Comparative annual stats, peak-to-trough analysis, and cycles tracking are coming soon.
        </p>
      </div>
    </div>
  );
}

export default Stats;

