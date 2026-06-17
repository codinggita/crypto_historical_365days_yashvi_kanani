import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import DataTable from './DataTable';
import { COIN_TABLE_COLUMNS } from '../../constants/tableConstants';
import { formatPrice, formatPercent, formatLargeNumber, getCoinInitials, getChangeClass } from '../../utils/format';

export function CoinTable({ coins = [], loading, sortBy, sortOrder, onSort, onToggleWatchlist, watchlistIds = [] }) {
  const navigate = useNavigate();

  const renderedColumns = React.useMemo(() => {
    return COIN_TABLE_COLUMNS.map((col) => {
      if (col.key === 'rank') {
        return {
          ...col,
          render: (val, row, idx) => <span className="coin-table-rank">{val || idx + 1}</span>,
        };
      }
      if (col.key === 'name') {
        return {
          ...col,
          render: (val, row) => {
            const initials = getCoinInitials(row.name, row.symbol);
            return (
              <div className="coin-table-identity">
                <div className="coin-logo-circle">{initials}</div>
                <div>
                  <div className="coin-table-name">{row.name || '—'}</div>
                  <div className="coin-table-symbol" style={{ textTransform: 'uppercase' }}>{row.symbol || '—'}</div>
                </div>
              </div>
            );
          },
        };
      }
      if (col.key === 'symbol') {
        return {
          ...col,
          render: (val) => <span style={{ textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{val}</span>,
        };
      }
      if (col.key === 'price') {
        return {
          ...col,
          render: (val) => <span className="coin-price">{formatPrice(val)}</span>,
        };
      }
      if (col.key === 'dailyReturn') {
        return {
          ...col,
          render: (val, row) => {
            const num = row.dailyReturn ?? row.change_24h ?? row.daily_return ?? 0;
            const cls = getChangeClass(num);
            return (
              <span className={`coin-change ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                {cls === 'positive' ? <FiTrendingUp /> : cls === 'negative' ? <FiTrendingDown /> : <FiMinus />}
                {formatPercent(num)}
              </span>
            );
          },
        };
      }
      if (col.key === 'marketCap') {
        return {
          ...col,
          render: (val, row) => <span>{formatLargeNumber(row.marketCap || row.market_cap)}</span>,
        };
      }
      if (col.key === 'volume') {
        return {
          ...col,
          render: (val, row) => <span>{formatLargeNumber(row.volume || row.volume_24h)}</span>,
        };
      }
      if (col.key === 'actions') {
        return {
          ...col,
          render: (val, row) => (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="coin-table-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/coins/${row._id || row.id || row.coinId}`);
                }}
                title="View details"
                style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <FiEye /> View
              </button>
            </div>
          ),
        };
      }
      return col;
    });
  }, [navigate, watchlistIds, onToggleWatchlist]);

  return (
    <DataTable
      columns={renderedColumns}
      data={coins}
      loading={loading}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      emptyMessage="No cryptocurrencies found."
      onRowClick={(row) => navigate(`/coins/${row._id || row.id || row.coinId}`)}
    />
  );
}

export default CoinTable;
