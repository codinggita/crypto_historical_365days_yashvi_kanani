import React from 'react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
} from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent, getCoinInitials } from '../../utils/format';

const OVERVIEW_CONFIGS = [
  {
    key: 'highestPrice',
    label: 'Highest Priced',
    icon: <FiDollarSign />,
    iconClass: 'amber',
    getValue: (d) => formatPrice(d?.data?.price ?? d?.data?.data?.price),
    getSub: (d) => d?.data?.name ?? d?.data?.data?.name ?? '—',
    getChange: null,
  },
  {
    key: 'lowestPrice',
    label: 'Lowest Priced',
    icon: <FiTrendingDown />,
    iconClass: 'red',
    getValue: (d) => formatPrice(d?.data?.price ?? d?.data?.data?.price),
    getSub: (d) => d?.data?.name ?? d?.data?.data?.name ?? '—',
    getChange: null,
  },
  {
    key: 'averagePrice',
    label: 'Avg Market Price',
    icon: <FiActivity />,
    iconClass: 'blue',
    getValue: (d) => formatPrice(d?.data?.averagePrice),
    getSub: () => 'Market Average',
    getChange: null,
  },
  {
    key: 'highestVolume',
    label: 'Highest Volume',
    icon: <FiBarChart2 />,
    iconClass: 'indigo',
    getValue: (d) => formatLargeNumber(d?.data?.volume ?? d?.data?.data?.volume),
    getSub: (d) => d?.data?.name ?? d?.data?.data?.name ?? '—',
    getChange: null,
  },
  {
    key: 'topReturn',
    label: 'Best Return',
    icon: <FiTrendingUp />,
    iconClass: 'green',
    getValue: (d) => formatPercent(d?.data?.[0]?.dailyReturn ?? d?.data?.data?.[0]?.dailyReturn),
    getSub: (d) => d?.data?.[0]?.name ?? d?.data?.data?.[0]?.name ?? '—',
    getChange: (d) => d?.data?.[0]?.dailyReturn ?? d?.data?.data?.[0]?.dailyReturn,
  },
  {
    key: 'highVolatility',
    label: 'Most Volatile',
    icon: <FiAlertTriangle />,
    iconClass: 'purple',
    getValue: (d) => (d?.data?.[0]?.volatility ?? d?.data?.data?.[0]?.volatility)
      ? `${parseFloat(d?.data?.[0]?.volatility ?? d?.data?.data?.[0]?.volatility).toFixed(2)}%`
      : '—',
    getSub: (d) => d?.data?.[0]?.name ?? d?.data?.data?.[0]?.name ?? '—',
    getChange: (d) => d?.data?.[0]?.volatility ?? d?.data?.data?.[0]?.volatility,
  },
];

function AnalyticsOverview({ data }) {
  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <h2 className="analytics-section-title">
          <FiActivity className="section-title-icon" />
          Market Overview
        </h2>
        <p className="analytics-section-subtitle">
          Live snapshot of key market metrics across all tracked assets
        </p>
      </div>
      <div className="analytics-overview-grid">
        {OVERVIEW_CONFIGS.map((cfg) => {
          const d = data?.[cfg.key];
          const value = d ? cfg.getValue(d) : '—';
          const sub = d ? cfg.getSub(d) : '—';
          const change = d && cfg.getChange ? cfg.getChange(d) : null;
          const isPositive = change !== null ? parseFloat(change) >= 0 : null;

          return (
            <div className="analytics-overview-card" key={cfg.key}>
              <div className="analytics-card-header">
                <span className="analytics-card-label">{cfg.label}</span>
                <div className={`stat-card-icon ${cfg.iconClass}`}>{cfg.icon}</div>
              </div>
              <div className="analytics-card-value">{value}</div>
              <div className="analytics-card-sub">{sub}</div>
              {change !== null && (
                <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                  <span>{formatPercent(change)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AnalyticsOverview;
