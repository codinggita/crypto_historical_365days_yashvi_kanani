import React from 'react';

function AnalyticsSkeleton() {
  return (
    <div className="skeleton-container animate-pulse">
      {/* Overview Cards Skeleton */}
      <div className="stats-grid">
        {[...Array(6)].map((_, i) => (
          <div className="stat-card skeleton-card" key={i}>
            <div className="skeleton-line short" />
            <div className="skeleton-line medium" style={{ marginTop: '0.8rem' }} />
            <div className="skeleton-line mini" style={{ marginTop: '0.5rem' }} />
          </div>
        ))}
      </div>

      {/* Chart Section Skeleton */}
      <div className="chart-skeleton-container shell-card" style={{ marginTop: '2rem', height: '400px' }}>
        <div className="skeleton-line short" />
        <div className="skeleton-chart" style={{ height: '300px', backgroundColor: 'var(--border-color)', opacity: 0.1, marginTop: '1rem', borderRadius: '8px' }} />
      </div>

      {/* Tables Grid Skeleton */}
      <div className="content-grid" style={{ marginTop: '2rem' }}>
        <div className="content-card">
          <div className="skeleton-line short" />
          <div className="skeleton-table" style={{ marginTop: '1rem' }}>
            {[...Array(5)].map((_, i) => (
              <div className="skeleton-row" key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0' }}>
                <div className="skeleton-line short" />
                <div className="skeleton-line mini" />
              </div>
            ))}
          </div>
        </div>
        <div className="content-card">
          <div className="skeleton-line short" />
          <div className="skeleton-table" style={{ marginTop: '1rem' }}>
            {[...Array(5)].map((_, i) => (
              <div className="skeleton-row" key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0' }}>
                <div className="skeleton-line short" />
                <div className="skeleton-line mini" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsSkeleton;
