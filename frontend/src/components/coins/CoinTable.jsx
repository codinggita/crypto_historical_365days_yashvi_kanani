import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronUp,
  ChevronDown,
  Eye,
  Sliders,
  Maximize2,
  Minimize2,
  Grid
} from 'lucide-react';
import { formatPrice, formatLargeNumber, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';

function SortIcon({ field, current, order }) {
  if (current !== field) return <ChevronUp className="sort-icon" style={{ opacity: 0.25 }} size={14} />;
  return order === 'asc'
    ? <ChevronUp className="sort-icon active" size={14} />
    : <ChevronDown className="sort-icon active" size={14} />;
}

function ChangeCell({ value }) {
  const cls = getChangeClass(value);
  const num = parseFloat(value);
  if (isNaN(num)) return <span className="coin-change neutral"><Minus size={12} /> —</span>;
  return (
    <span className={`coin-change ${cls}`}>
      {cls === 'positive' ? <ArrowUpRight size={13} /> : cls === 'negative' ? <ArrowDownRight size={13} /> : <Minus size={13} />}
      {Math.abs(num).toFixed(2)}%
    </span>
  );
}

const ALL_COLUMNS = [
  { key: 'rank',       label: '#',           sortable: true,  width: 50,  alwaysVisible: true },
  { key: 'name',       label: 'Coin',         sortable: true,  width: 200, alwaysVisible: true },
  { key: 'price',      label: 'Price',        sortable: true,  width: 130, alwaysVisible: true },
  { key: 'dailyReturn',label: '24h Change',   sortable: true,  width: 110, alwaysVisible: true },
  { key: 'marketCap',  label: 'Market Cap',   sortable: true,  width: 140, alwaysVisible: false },
  { key: 'volume',     label: '24h Volume',   sortable: true,  width: 140, alwaysVisible: false },
  { key: 'volatility', label: 'Volatility',   sortable: true,  width: 110, alwaysVisible: false },
  { key: 'category',   label: 'Category',     sortable: false, width: 110, alwaysVisible: false },
  { key: 'actions',    label: '',             sortable: false, width: 80,  alwaysVisible: true },
];

function CoinTable({ coins, sortBy, sortOrder, onSort }) {
  const navigate = useNavigate();

  // Density: 'compact' | 'normal' | 'spacious'
  const [density, setDensity] = useState('normal');

  // Column Visibility state (defaulting to showing everything)
  const [visibleKeys, setVisibleKeys] = useState([
    'rank', 'name', 'price', 'dailyReturn', 'marketCap', 'volume', 'volatility', 'category', 'actions'
  ]);

  const [densityDropdownOpen, setDensityDropdownOpen] = useState(false);
  const [colDropdownOpen, setColDropdownOpen] = useState(false);

  const densityRef = useRef(null);
  const colRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e) => {
      if (densityRef.current && !densityRef.current.contains(e.target)) {
        setDensityDropdownOpen(false);
      }
      if (colRef.current && !colRef.current.contains(e.target)) {
        setColDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSort = (key) => {
    if (!ALL_COLUMNS.find((c) => c.key === key)?.sortable) return;
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  const toggleColumn = (key) => {
    if (visibleKeys.includes(key)) {
      // Don't hide if it's marked alwaysVisible
      if (ALL_COLUMNS.find(c => c.key === key)?.alwaysVisible) return;
      setVisibleKeys(visibleKeys.filter(k => k !== key));
    } else {
      setVisibleKeys([...visibleKeys, key]);
    }
  };

  const columnsToRender = ALL_COLUMNS.filter(col => visibleKeys.includes(col.key));

  return (
    <div>
      {/* Table Customizer Bar */}
      <div className="table-customizer-bar">
        {/* Density Selector */}
        <div className="table-custom-dropdown" ref={densityRef}>
          <button 
            className="table-custom-btn"
            onClick={() => setDensityDropdownOpen(!densityDropdownOpen)}
          >
            <Sliders size={14} />
            <span>Density: {density.charAt(0).toUpperCase() + density.slice(1)}</span>
          </button>
          <AnimatePresence>
            {densityDropdownOpen && (
              <motion.div 
                className="table-dropdown-menu"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <span className="table-dropdown-title">Row Spacing</span>
                <button 
                  className={`density-option ${density === 'compact' ? 'active' : ''}`}
                  onClick={() => { setDensity('compact'); setDensityDropdownOpen(false); }}
                >
                  Compact
                </button>
                <button 
                  className={`density-option ${density === 'normal' ? 'active' : ''}`}
                  onClick={() => { setDensity('normal'); setDensityDropdownOpen(false); }}
                >
                  Normal
                </button>
                <button 
                  className={`density-option ${density === 'spacious' ? 'active' : ''}`}
                  onClick={() => { setDensity('spacious'); setDensityDropdownOpen(false); }}
                >
                  Spacious
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Column Visibility Selector */}
        <div className="table-custom-dropdown" ref={colRef}>
          <button 
            className="table-custom-btn"
            onClick={() => setColDropdownOpen(!colDropdownOpen)}
          >
            <Grid size={14} />
            <span>Visible Columns</span>
          </button>
          <AnimatePresence>
            {colDropdownOpen && (
              <motion.div 
                className="table-dropdown-menu"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                style={{ minWidth: '200px' }}
              >
                <span className="table-dropdown-title">Toggle Columns</span>
                {ALL_COLUMNS.map(col => {
                  if (col.alwaysVisible) return null;
                  return (
                    <label key={col.key} className="table-dropdown-checkbox-label">
                      <input
                        type="checkbox"
                        className="table-dropdown-checkbox"
                        checked={visibleKeys.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                      />
                      <span>{col.label}</span>
                    </label>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Spaced Rounded Table */}
      <div className="coin-table-wrap">
        <table className={`coin-table density-${density}`}>
          <thead>
            <tr>
              {columnsToRender.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? 'sortable' : ''}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
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
            {coins.map((coin, i) => {
              const initials   = getCoinInitials(coin.name, coin.symbol);
              const change     = coin.dailyReturn ?? coin.daily_return ?? coin.change_24h ?? 0;
              const mcap       = coin.marketCap   ?? coin.market_cap ?? 0;
              const vol        = coin.volume      ?? coin.volume_24h ?? 0;
              const volatility = coin.volatility  ?? 0;
              const navId      = coin.coinId || coin._id || coin.id || coin.symbol?.toLowerCase();

              return (
                <motion.tr 
                  key={coin._id || coin.id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.2) }}
                >
                  {visibleKeys.includes('rank') && (
                    <td className="coin-table-rank">{coin.rank || i + 1}</td>
                  )}
                  {visibleKeys.includes('name') && (
                    <td>
                      <div className="coin-table-identity">
                        {coin.image ? (
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="coin-logo-img" 
                            onError={(e) => { 
                              e.target.style.display = 'none'; 
                              e.target.nextSibling.style.display = 'flex'; 
                            }} 
                          />
                        ) : null}
                        <div className="coin-logo-circle" style={coin.image ? { display: 'none' } : {}}>
                          {initials}
                        </div>
                        <div>
                          <div className="coin-table-name">{coin.name || '—'}</div>
                          <div className="coin-table-symbol">{coin.symbol?.toUpperCase() || '—'}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleKeys.includes('price') && (
                    <td className="coin-price">{formatPrice(coin.price)}</td>
                  )}
                  {visibleKeys.includes('dailyReturn') && (
                    <td><ChangeCell value={change} /></td>
                  )}
                  {visibleKeys.includes('marketCap') && (
                    <td>{mcap ? formatLargeNumber(mcap) : '—'}</td>
                  )}
                  {visibleKeys.includes('volume') && (
                    <td>{vol ? formatLargeNumber(vol) : '—'}</td>
                  )}
                  {visibleKeys.includes('volatility') && (
                    <td><ChangeCell value={volatility} /></td>
                  )}
                  {visibleKeys.includes('category') && (
                    <td>
                      {coin.category ? (
                        <span className="badge">{coin.category}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                  )}
                  {visibleKeys.includes('actions') && (
                    <td>
                      <button
                        className="coin-table-action-btn"
                        onClick={() => navigate(`/coins/${navId}`)}
                        id={`view-coin-${coin.symbol || i}`}
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CoinTable;
