import React from 'react';
import {
  FiTrendingUp,
  FiActivity,
  FiDollarSign,
  FiBarChart2,
  FiArrowUpRight,
  FiArrowDownRight,
  FiMinus,
} from 'react-icons/fi';
import { formatCurrency, formatLargeNumber, formatPercent } from '../../utils/format';

const CARDS_CONFIG = [
  {
    key: 'totalMarketCap',
    label: 'Total Market Cap',
    icon: FiDollarSign,
    changeKey: 'marketCapChange24h',
  },
  {
    key: 'totalVolume24h',
    label: '24h Volume',
    icon: FiActivity,
    changeKey: 'volumeChange24h',
  },
  {
    key: 'btcDominance',
    label: 'BTC Dominance',
    icon: FiBarChart2,
    changeKey: null,
    format: (v) => (v != null ? `${parseFloat(v).toFixed(2)}%` : '—'),
  },
  {
    key: 'activeCryptos',
    label: 'Active Cryptos',
    icon: FiTrendingUp,
    changeKey: null,
    format: (v) => (v != null ? Number(v).toLocaleString() : '—'),
  },
  {
    key: 'totalExchanges',
    label: 'Exchanges',
    icon: FiBarChart2,
    changeKey: null,
    format: (v) => (v != null ? Number(v).toLocaleString() : '—'),
  },
];

function ChangeIndicator({ value }) {
  if (value == null) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  if (num > 0)
    return (
      <span className="market-card-sub positive">
        <FiArrowUpRight /> +{num.toFixed(2)}%
      </span>
    );
  if (num < 0)
    return (
      <span className="market-card-sub negative">
        <FiArrowDownRight /> {num.toFixed(2)}%
      </span>
    );
  return (
    <span className="market-card-sub neutral">
      <FiMinus /> {num.toFixed(2)}%
    </span>
  );
}

function MarketSummaryCards({ summary }) {
  const defaultValue = (key, format) => {
    if (!summary) return '—';
    const raw = summary[key];
    if (raw == null) return '—';
    if (format) return format(raw);
    return formatLargeNumber(raw);
  };

  return (
    <div className="market-summary-grid">
      {CARDS_CONFIG.map(({ key, label, icon: Icon, changeKey, format }) => (
        <div key={key} className="market-card">
          <div className="market-card-label">
            <Icon />
            {label}
          </div>
          <div className="market-card-value">{defaultValue(key, format)}</div>
          {changeKey != null && <ChangeIndicator value={summary?.[changeKey]} />}
        </div>
      ))}
    </div>
  );
}

export default MarketSummaryCards;
