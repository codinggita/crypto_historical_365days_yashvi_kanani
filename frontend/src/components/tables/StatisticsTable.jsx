import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent, getChangeClass } from '../../utils/format';

export function StatisticsTable({ data = [], type = 'gainers', loading }) {
  if (loading) {
    return (
      <div className="coin-table-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-pulse" style={{ height: '2.5rem', borderRadius: '8px', marginBottom: '0.5rem' }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No statistics data available.
      </div>
    );
  }

  return (
    <div className="coin-table-wrap">
      <table className="coin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>{type === 'gainers' ? 'Gain' : type === 'losers' ? 'Loss' : 'Change'}</th>
            <th>Market Cap</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const change = row.dailyReturn ?? row.daily_return ?? row.changePercent ?? 0;
            const cls = getChangeClass(change);
            const initials = (row.symbol || row.name || 'C').slice(0, 2).toUpperCase();
            return (
              <tr key={row._id || row.id || idx}>
                <td className="coin-table-rank">{row.rank || idx + 1}</td>
                <td>
                  <div className="coin-table-identity">
                    <div className="coin-logo-circle">{initials}</div>
                    <div>
                      <div className="coin-table-name">{row.name || '—'}</div>
                      <div className="coin-table-symbol">{row.symbol || '—'}</div>
                    </div>
                  </div>
                </td>
                <td><span className="coin-price">{formatPrice(row.price || row.close)}</span></td>
                <td>
                  <span className={`coin-change ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                    {change > 0 ? <FiTrendingUp /> : change < 0 ? <FiTrendingDown /> : <FiMinus />}
                    {formatPercent(change)}
                  </span>
                </td>
                <td>{formatLargeNumber(row.marketCap || row.market_cap)}</td>
                <td>{formatLargeNumber(row.volume || row.volume_24h)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StatisticsTable;
