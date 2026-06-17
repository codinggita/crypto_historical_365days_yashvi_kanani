import React from 'react';
import { FiTrash2, FiEdit, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import DataTable from './DataTable';
import { WATCHLIST_TABLE_COLUMNS } from '../../constants/tableConstants';
import { formatPrice, getCoinInitials, getChangeClass, formatPercent } from '../../utils/format';

export function WatchlistTable({ bookmarks = [], loading, onEdit, onDelete }) {
  const renderedColumns = React.useMemo(() => {
    return WATCHLIST_TABLE_COLUMNS.map((col) => {
      if (col.key === 'coin') {
        return {
          ...col,
          render: (val, row) => {
            const initials = getCoinInitials(row.coinName || row.name || 'C', row.symbol || 'C');
            return (
              <div className="coin-table-identity">
                <div className="coin-logo-circle">{initials}</div>
                <div>
                  <div className="coin-table-name">{row.coinName || row.name || '—'}</div>
                  <div className="coin-table-symbol" style={{ textTransform: 'uppercase' }}>{row.symbol || '—'}</div>
                </div>
              </div>
            );
          },
        };
      }
      if (col.key === 'addedPrice') {
        return {
          ...col,
          render: (val) => <span style={{ fontFamily: "'Roboto Mono', monospace" }}>{formatPrice(val)}</span>,
        };
      }
      if (col.key === 'price') {
        return {
          ...col,
          render: (val, row) => {
            const price = row.currentPrice || row.price || 0;
            return <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>{formatPrice(price)}</span>;
          },
        };
      }
      if (col.key === 'change') {
        return {
          ...col,
          render: (val, row) => {
            const added = row.addedPrice || 0;
            const current = row.currentPrice || row.price || 0;
            const changeVal = added > 0 ? ((current - added) / added) * 100 : 0;
            const cls = getChangeClass(changeVal);

            return (
              <span className={`coin-change ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                {changeVal > 0 ? <FiTrendingUp /> : changeVal < 0 ? <FiTrendingDown /> : <FiMinus />}
                {formatPercent(changeVal)}
              </span>
            );
          },
        };
      }
      if (col.key === 'category') {
        return {
          ...col,
          render: (val) => (
            <span
              className="badge"
              style={{
                fontSize: '0.7rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                textTransform: 'capitalize',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                margin: 0,
              }}
            >
              {val || 'Watchlist'}
            </span>
          ),
        };
      }
      if (col.key === 'actions') {
        return {
          ...col,
          render: (val, row) => (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              {onEdit && (
                <button
                  className="coin-table-action-btn"
                  onClick={() => onEdit(row)}
                  title="Edit Category or Notes"
                  style={{ padding: '0.4rem', borderRadius: '6px' }}
                >
                  <FiEdit />
                </button>
              )}
              {onDelete && (
                <button
                  className="coin-table-action-btn"
                  onClick={() => onDelete(row._id || row.id || row.coinId)}
                  title="Remove from watchlist"
                  style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ),
        };
      }
      return col;
    });
  }, [bookmarks, onEdit, onDelete]);

  return (
    <DataTable
      columns={renderedColumns}
      data={bookmarks}
      loading={loading}
      emptyMessage="No bookmarked assets found in your watchlist."
    />
  );
}

export default WatchlistTable;
