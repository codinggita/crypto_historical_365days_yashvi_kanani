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
  { key: 'dailyReturn',label: '24h Change',   sortable: true,  width: 110 },
  { key: 'marketCap',  label: 'Market Cap',   sortable: true,  width: 140 },
  { key: 'volume',     label: '24h Volume',   sortable: true,  width: 140 },
  { key: 'volatility', label: 'Volatility',   sortable: true,  width: 110 },
  { key: 'category',   label: 'Category',     sortable: false, width: 110 },
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
            const initials   = getCoinInitials(coin.name, coin.symbol);
            // Support both backend field names
            const change     = coin.dailyReturn ?? coin.daily_return ?? coin.change_24h ?? 0;
            const mcap       = coin.marketCap   ?? coin.market_cap ?? 0;
            const vol        = coin.volume      ?? coin.volume_24h ?? 0;
            const volatility = coin.volatility  ?? 0;
            // Navigate by coinId slug (e.g. "bitcoin") which works with findCoinByFlexibleId
            const navId      = coin.coinId || coin._id || coin.id || coin.symbol?.toLowerCase();

            return (
              <tr key={coin._id || coin.id || i}>
                <td className="coin-table-rank">{coin.rank || i + 1}</td>
                <td>
                  <div className="coin-table-identity">
                    {coin.image
                      ? <img src={coin.image} alt={coin.name} className="coin-logo-img" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      : null}
                    <div className="coin-logo-circle" style={coin.image ? { display: 'none' } : {}}>{initials}</div>
                    <div>
                      <div className="coin-table-name">{coin.name || '—'}</div>
                      <div className="coin-table-symbol">{coin.symbol || '—'}</div>
                    </div>
                  </div>
                </td>
                <td className="coin-price">{formatPrice(coin.price)}</td>
                <td><ChangeCell value={change} /></td>
                <td>{mcap ? formatLargeNumber(mcap) : '—'}</td>
                <td>{vol ? formatLargeNumber(vol) : '—'}</td>
                <td><ChangeCell value={volatility} /></td>
                <td>
                  {coin.category
                    ? <span style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', whiteSpace: 'nowrap' }}>{coin.category}</span>
                    : '—'
                  }
                </td>
                <td>
                  <button
                    className="coin-table-action-btn"
                    onClick={() => navigate(`/coins/${navId}`)}
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
