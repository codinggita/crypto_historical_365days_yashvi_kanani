import React from 'react';
import { FiTrash2, FiEdit2, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import DataTable from './DataTable';
import { PORTFOLIO_TABLE_COLUMNS } from '../../constants/tableConstants';
import { formatPrice, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';

export function PortfolioTable({ holdings = [], loading, onEdit, onDelete }) {
  const renderedColumns = React.useMemo(() => {
    return PORTFOLIO_TABLE_COLUMNS.map((col) => {
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
      if (col.key === 'quantity') {
        return {
          ...col,
          render: (val) => <span style={{ fontFamily: "'Roboto Mono', monospace" }}>{parseFloat(val || 0).toLocaleString()}</span>,
        };
      }
      if (col.key === 'buyPrice') {
        return {
          ...col,
          render: (val) => <span style={{ fontFamily: "'Roboto Mono', monospace" }}>{formatPrice(val)}</span>,
        };
      }
      if (col.key === 'currentPrice') {
        return {
          ...col,
          render: (val) => <span style={{ fontFamily: "'Roboto Mono', monospace" }}>{formatPrice(val)}</span>,
        };
      }
      if (col.key === 'invested') {
        return {
          ...col,
          render: (val, row) => {
            const amt = (row.quantity || 0) * (row.buyPrice || 0);
            return <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 500 }}>{formatPrice(amt)}</span>;
          },
        };
      }
      if (col.key === 'currentValue') {
        return {
          ...col,
          render: (val, row) => {
            const amt = (row.quantity || 0) * (row.currentPrice || 0);
            return <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 500 }}>{formatPrice(amt)}</span>;
          },
        };
      }
      if (col.key === 'pnl') {
        return {
          ...col,
          render: (val, row) => {
            const invested = (row.quantity || 0) * (row.buyPrice || 0);
            const current = (row.quantity || 0) * (row.currentPrice || 0);
            const pnl = current - invested;
            const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
            const cls = getChangeClass(pnl);

            return (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={`coin-change ${cls}`} style={{ fontWeight: 700 }}>
                  {pnl >= 0 ? '+' : ''}{formatPrice(pnl)}
                </span>
                <span className={cls} style={{ fontSize: '0.75rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                  {pnl > 0 ? <FiTrendingUp /> : pnl < 0 ? <FiTrendingDown /> : <FiMinus />}
                  {pnlPercent.toFixed(2)}%
                </span>
              </div>
            );
          },
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
                  title="Edit entry"
                  style={{ padding: '0.4rem', borderRadius: '6px' }}
                >
                  <FiEdit2 />
                </button>
              )}
              {onDelete && (
                <button
                  className="coin-table-action-btn"
                  onClick={() => onDelete(row._id || row.id)}
                  title="Remove from portfolio"
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
  }, [holdings, onEdit, onDelete]);

  return (
    <DataTable
      columns={renderedColumns}
      data={holdings}
      loading={loading}
      emptyMessage="Your portfolio is empty. Add assets below to track investment performance."
    />
  );
}

export default PortfolioTable;
