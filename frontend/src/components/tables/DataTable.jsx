import React from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

function SortIcon({ field, current, order }) {
  if (current !== field) return <span style={{ opacity: 0.35, marginLeft: '0.25rem' }}>⇅</span>;
  return order === 'asc'
    ? <FiChevronUp style={{ marginLeft: '0.25rem', color: 'var(--color-primary)' }} />
    : <FiChevronDown style={{ marginLeft: '0.25rem', color: 'var(--color-primary)' }} />;
}

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  sortBy = '',
  sortOrder = 'asc',
  onSort = () => {},
  emptyMessage = 'No data available',
  onRowClick,
}) {
  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortBy === col.key) {
      onSort(col.key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(col.key, 'asc');
    }
  };

  return (
    <div className="coin-table-wrap">
      <table className="coin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                style={{ width: col.width, cursor: col.sortable ? 'pointer' : 'default' }}
                onClick={() => handleSort(col)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {col.label}
                  {col.sortable && <SortIcon field={col.key} current={sortBy} order={sortOrder} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`loader-${i}`}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <div className="skeleton-pulse" style={{ height: '1.25rem', borderRadius: '4px', width: '80%' }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row, rowIndex) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
