import React from 'react';
import { FiArrowUpRight, FiArrowDownRight, FiMinus, FiChevronUp, FiChevronDown, FiEye } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

function SortIcon({ field, current, order }) {
  if (current !== field) return <FiChevronUp className="sort-icon" style={{ opacity: 0.25 }} />;
  return order === 'asc'
    ? <FiChevronUp className="sort-icon active" />
    : <FiChevronDown className="sort-icon active" />;
}

function ChangeCell({ value }) {
  const cls = getChangeClass(value);
  const num = parseFloat(value);
  if (isNaN(num)) return <span className="coin-change neutral"><FiMinus /> —</span>;
  return (
    <span className={`coin-change ${cls}`}>
      {cls === 'positive' ? <FiArrowUpRight /> : cls === 'negative' ? <FiArrowDownRight /> : <FiMinus />}
      {Math.abs(num).toFixed(2)}%
    </span>
  );
}

const COLUMNS = [
  { key: 'rank',       label: '#',           sortable: true,  width: 50  },
  { key: 'name',       label: 'Coin',         sortable: true,  width: 200 },
  { key: 'price',      label: 'Price',        sortable: true,  width: 130 },
  { key: 'change_24h', label: '24h Change',   sortable: true,  width: 110 },
  { key: 'market_cap', label: 'Market Cap',   sortable: true,  width: 140 },
  { key: 'volume_24h', label: '24h Volume',   sortable: true,  width: 140 },
  { key: 'high_24h',   label: '24h High',     sortable: false, width: 120 },
  { key: 'low_24h',    label: '24h Low',      sortable: false, width: 120 },
  { key: 'actions',    label: '',             sortable: false, width: 80  },
];

function CoinTable({ coins, sortBy, sortOrder, onSort }) {
  const navigate = useNavigate();

  const handleSort = (key) => {
    if (!COLUMNS.find((c) => c.key === key)?.sortable) return;
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  return (
    <div className="coin-table-wrap">
      <table className="coin-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && <SortIcon field={col.key} current={sortBy} order={sortOrder} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, i) => {
            const initials = getCoinInitials(coin.name, coin.symbol);
            return (
              <tr key={coin._id || coin.id || i}>
                <td className="coin-table-rank">
                  {coin.rank || i + 1}
                </td>
                <td>
                  <div className="coin-table-identity">
                    <div className="coin-logo-circle">{initials}</div>
                    <div>
                      <div className="coin-table-name">{coin.name || '—'}</div>
                      <div className="coin-table-symbol">{coin.symbol || '—'}</div>
                    </div>
                  </div>
                </td>
                <td className="coin-price">{formatPrice(coin.price ?? coin.close ?? coin.open)}</td>
                <td><ChangeCell value={coin.change_24h ?? coin.daily_return} /></td>
                <td>{formatLargeNumber(coin.market_cap)}</td>
                <td>{formatLargeNumber(coin.volume_24h ?? coin.volume)}</td>
                <td>{formatPrice(coin.high_24h ?? coin.high)}</td>
                <td>{formatPrice(coin.low_24h ?? coin.low)}</td>
                <td>
                  <button
                    className="coin-table-action-btn"
                    onClick={() => navigate(`/coins/${coin._id || coin.id || coin.symbol}`)}
                    id={`view-coin-${coin.symbol || i}`}
                  >
                    <FiEye style={{ marginRight: '0.25rem' }} /> View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CoinTable;
