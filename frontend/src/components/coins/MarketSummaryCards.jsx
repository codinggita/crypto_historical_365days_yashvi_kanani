import React from 'react';
import {
  FiTrendingUp,
  FiActivity,
  FiDollarSign,
  FiBarChart2,
  FiPieChart,
  FiArrowUpRight,
  FiArrowDownRight,
  FiMinus,
} from 'react-icons/fi';
import { formatLargeNumber, formatPercent } from '../../utils/format';

/**
 * MarketSummaryCards — maps fields returned by backend getMarketSummary:
 *   { totalMarketCap, totalVolume, totalCoins, averagePrice, averageVolatility }
 * plus derived btcDominance computed client-side.
 */
function MarketSummaryCards({ summary, coins = [] }) {
  if (!summary) {
    // Loading / no data state
    return (
      <div className="market-summary-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="market-card">
            <div className="skeleton-pulse" style={{ height: '0.7rem', width: '60%', borderRadius: 4, marginBottom: '0.6rem' }} />
            <div className="skeleton-pulse" style={{ height: '1.4rem', width: '80%', borderRadius: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  // Field aliases — backend can return either camelCase or snake_case
  const totalMarketCap = summary.totalMarketCap ?? summary.total_market_cap ?? 0;
  const totalVolume    = summary.totalVolume    ?? summary.total_volume    ?? summary.totalVolume24h ?? 0;
  const totalCoins     = summary.totalCoins     ?? summary.total_coins     ?? summary.count          ?? 0;
  const avgVolatility  = summary.averageVolatility ?? summary.avg_volatility ?? 0;

  // BTC dominance: computed from coins list if available, else from summary
  let btcDominance = summary.btcDominance ?? null;
  if (btcDominance == null && coins.length > 0) {
    const btc = coins.find((c) => c.coinId === 'bitcoin' || c.symbol === 'BTC');
    const btcMcap = btc?.marketCap ?? 0;
    btcDominance = totalMarketCap > 0 ? ((btcMcap / totalMarketCap) * 100).toFixed(2) : null;
  }

  const CARDS = [
    {
      label: 'Total Market Cap',
      icon: FiDollarSign,
      value: formatLargeNumber(totalMarketCap),
      sub: null,
    },
    {
      label: '24h Volume',
      icon: FiActivity,
      value: formatLargeNumber(totalVolume),
      sub: null,
    },
    {
      label: 'BTC Dominance',
      icon: FiPieChart,
      value: btcDominance != null ? `${parseFloat(btcDominance).toFixed(2)}%` : '—',
      sub: null,
    },
    {
      label: 'Active Cryptos',
      icon: FiTrendingUp,
      value: totalCoins ? Number(totalCoins).toLocaleString() : '—',
      sub: null,
    },
    {
      label: 'Avg Volatility',
      icon: FiBarChart2,
      value: avgVolatility ? `${parseFloat(avgVolatility).toFixed(2)}%` : '—',
      sub: null,
    },
  ];

  return (
    <div className="market-summary-grid">
      {CARDS.map(({ label, icon: Icon, value, sub }) => (
        <div key={label} className="market-card">
          <div className="market-card-label">
            <Icon />
            {label}
          </div>
          <div className="market-card-value">{value}</div>
          {sub && <div className="market-card-sub">{sub}</div>}
        </div>
      ))}
    </div>
  );
}

export default MarketSummaryCards;
