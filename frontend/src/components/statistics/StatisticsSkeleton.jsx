import React from 'react';

function StatisticsSkeleton() {
  return (
    <div className="skeleton-container animate-pulse">
      {/* Overview Cards Skeleton */}
      <div className="statistics-overview-grid" style={{ marginBottom: '2.5rem' }}>
        {[...Array(6)].map((_, i) => (
          <div className="statistics-overview-card skeleton-card" key={i} style={{ height: '140px' }}>
            <div className="skeleton-line short" />
            <div className="skeleton-line medium" style={{ marginTop: '1rem', height: '24px' }} />
            <div className="skeleton-line mini" style={{ marginTop: '0.6rem' }} />
          </div>
        ))}
      </div>

      {/* Chart Section Skeletons */}
      <div className="statistics-charts-grid" style={{ marginBottom: '2.5rem' }}>
        {[...Array(4)].map((_, i) => (
          <div className="statistics-chart-card skeleton-card" key={i} style={{ height: '360px' }}>
            <div className="skeleton-line short" />
            <div className="skeleton-chart" style={{ height: '260px', backgroundColor: 'var(--border-color)', opacity: 0.1, marginTop: '1.5rem', borderRadius: '8px' }} />
          </div>
        ))}
      </div>

      {/* Tables & Report Skeletons */}
      <div className="statistics-table-card skeleton-card" style={{ height: '320px', marginBottom: '2.5rem' }}>
        <div className="skeleton-line short" style={{ marginBottom: '1.5rem' }} />
        <div className="skeleton-table">
          {[...Array(4)].map((_, i) => (
            <div className="skeleton-row" key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div className="skeleton-line short" />
              <div className="skeleton-line medium" />
              <div className="skeleton-line mini" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatisticsSkeleton;
