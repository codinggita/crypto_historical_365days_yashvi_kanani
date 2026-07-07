import React from 'react';
import {
  TrendingUp,
  Activity,
  DollarSign,
  BarChart3,
  PieChart,
  Minus
} from 'lucide-react';
import { formatLargeNumber, formatPercent } from '../../utils/format';

function MarketSummaryCards({ summary, coins = [] }) {
  if (!summary) {
    return (
      <div className="market-summary-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="market-card" aria-hidden="true">
            <div className="skeleton-pulse" style={{ height: '0.7rem', width: '60%', borderRadius: 4, marginBottom: '0.6rem' }} />
            <div className="skeleton-pulse" style={{ height: '1.4rem', width: '80%', borderRadius: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  const totalMarketCap = summary.totalMarketCap ?? summary.total_market_cap ?? 0;
  const totalVolume    = summary.totalVolume    ?? summary.total_volume    ?? summary.totalVolume24h ?? 0;
  const totalCoins     = summary.totalCoins     ?? summary.total_coins     ?? summary.count          ?? 0;
  const avgVolatility  = summary.averageVolatility ?? summary.avg_volatility ?? 0;

  let btcDominance = summary.btcDominance ?? null;
  if (btcDominance == null && coins.length > 0) {
    const btc = coins.find((c) => c.coinId === 'bitcoin' || c.symbol === 'BTC');
    const btcMcap = btc?.marketCap ?? 0;
    btcDominance = totalMarketCap > 0 ? ((btcMcap / totalMarketCap) * 100).toFixed(2) : null;
  }

  const CARDS = [
    {
      label: 'Total Market Cap',
      icon: DollarSign,
      value: formatLargeNumber(totalMarketCap),
      sub: null,
    },
    {
      label: '24h Volume',
      icon: Activity,
      value: formatLargeNumber(totalVolume),
      sub: null,
    },
    {
      label: 'BTC Dominance',
      icon: PieChart,
      value: btcDominance != null ? `${parseFloat(btcDominance).toFixed(2)}%` : '—',
      sub: null,
    },
    {
      label: 'Active Cryptos',
      icon: TrendingUp,
      value: totalCoins ? Number(totalCoins).toLocaleString() : '—',
      sub: null,
    },
    {
      label: 'Avg Volatility',
      icon: BarChart3,
      value: avgVolatility ? `${parseFloat(avgVolatility).toFixed(2)}%` : '—',
      sub: null,
    },
  ];

  return (
    <div className="market-summary-grid">
      {CARDS.map(({ label, icon: Icon, value, sub }) => (
        <div key={label} className="market-card">
          <div className="market-card-label">
            <Icon size={14} className="text-primary" />
            <span>{label}</span>
          </div>
          <div className="market-card-value">{value}</div>
          {sub && <div className="market-card-sub">{sub}</div>}
        </div>
      ))}
    </div>
  );
}

export default MarketSummaryCards;
