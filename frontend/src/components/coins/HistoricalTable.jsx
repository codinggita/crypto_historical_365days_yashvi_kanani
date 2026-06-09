import React, { useState, useMemo } from 'react';
import { formatCurrency, formatLargeNumber, formatPercent, formatDate } from '../../utils/format';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiCalendar } from 'react-icons/fi';

const PAGE_SIZE = 10;

function HistoricalTable({ history }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort history chronologically descending (newest first) for tabular representation
  const sortedHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [history]);

  const totalPages = Math.ceil(sortedHistory.length / PAGE_SIZE) || 1;

  // Reset page when dataset updates
  React.useEffect(() => {
    setCurrentPage(1);
  }, [history]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedHistory.slice(start, start + PAGE_SIZE);
  }, [sortedHistory, currentPage]);

  if (sortedHistory.length === 0) {
    return (
      <div className="table-section-card">
        <h3 className="details-section-title">
          <FiCalendar /> Historical Records
        </h3>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-layout)' }}>
          No historical records found for this asset.
        </div>
      </div>
    );
  }

  return (
    <div className="table-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 className="details-section-title" style={{ margin: 0 }}>
          <FiCalendar style={{ color: '#818cf8' }} /> Historical Timeline Records
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-layout)' }}>
          Showing {paginatedData.length} of {sortedHistory.length} total entries
        </span>
      </div>

      <div className="details-table-wrap">
        <table className="details-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Price</th>
              <th>24h Volume</th>
              <th>Market Cap</th>
              <th>Daily Return</th>
              <th>Volatility</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => {
              const p = row.price ?? row.close ?? row.open ?? 0;
              const v = row.volume ?? row.volume_24h ?? 0;
              const m = row.marketCap ?? row.market_cap ?? 0;
              const r = row.dailyReturn ?? row.daily_return ?? 0;
              const vol = row.volatility ?? 0;

              const retCls = r > 0 ? 'positive' : r < 0 ? 'negative' : '';

              return (
                <tr key={row._id || idx}>
                  <td className="details-table-date">{formatDate(row.timestamp)}</td>
                  <td style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                    {formatCurrency(p, p < 1 ? 5 : 2)}
                  </td>
                  <td>{formatLargeNumber(v)}</td>
                  <td>{formatLargeNumber(m)}</td>
                  <td className={retCls} style={{ fontWeight: 700 }}>
                    {formatPercent(r)}
                  </td>
                  <td>{vol.toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Local Pagination controls */}
      {totalPages > 1 && (
        <div className="coins-pagination" style={{ marginTop: '0.5rem' }}>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            title="First Page"
          >
            <FiChevronsLeft />
          </button>
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            title="Previous Page"
          >
            <FiChevronLeft />
          </button>
          
          <span style={{ margin: '0 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted-layout)', fontWeight: 600 }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            title="Next Page"
          >
            <FiChevronRight />
          </button>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Last Page"
          >
            <FiChevronsRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default HistoricalTable;
