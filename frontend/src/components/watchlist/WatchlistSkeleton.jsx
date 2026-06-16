import React from 'react';

function WatchlistSkeleton() {
  return (
    <div className="watchlist-skeleton-wrapper">
      {/* Overview Cards Shimmer */}
      <div className="watchlist-skeleton-cards">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="watchlist-skeleton-card-item skeleton-shimmer">
            <div className="skeleton-bar title" />
            <div className="skeleton-bar value" />
            <div className="skeleton-bar subtitle" />
          </div>
        ))}
      </div>

      {/* Filter panel Shimmer */}
      <div className="watchlist-skeleton-filters skeleton-shimmer">
        <div className="skeleton-bar filter-search" />
        <div className="skeleton-bar filter-select" />
        <div className="skeleton-bar filter-select" />
        <div className="skeleton-bar view-toggle" />
      </div>

      {/* Main Content Shimmer (Table / Cards) */}
      <div className="watchlist-skeleton-main">
        <div className="watchlist-skeleton-table skeleton-shimmer">
          <div className="skeleton-table-header">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-table-col" />
            ))}
          </div>
          <div className="skeleton-table-rows">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="skeleton-table-row">
                {[1, 2, 3, 4, 5, 6].map((col) => (
                  <div key={col} className="skeleton-table-cell" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchlistSkeleton;
