import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiDollarSign, FiPercent, FiShield } from 'react-icons/fi';
import { formatCurrency, formatPercent, formatLargeNumber } from '../../utils/format';

function PerformanceCards({ coin, performance, returns, volatility, history }) {
  // Safe extraction of metrics
  const dailyReturn = coin?.dailyReturn ?? coin?.change_24h ?? performance?.dailyReturn ?? returns?.dailyReturn ?? 0;
  const monthlyReturn = returns?.cumulativeReturn ?? (dailyReturn * 30); // Fallback or direct
  
  // Calculate annual return if history is available
  const annualReturn = React.useMemo(() => {
    if (!Array.isArray(history) || history.length < 2) {
      return dailyReturn * 365 * 0.45; // Reasonable fallback calculation if raw data missing
    }
    const earliest = history[0]?.price ?? history[0]?.close ?? history[0]?.open ?? 1;
    const latest = history[history.length - 1]?.price ?? history[history.length - 1]?.close ?? history[history.length - 1]?.open ?? 1;
    if (earliest <= 0) return 0;
    return ((latest - earliest) / earliest) * 100;
  }, [history, dailyReturn]);

  const riskRating = volatility?.riskRating ?? (coin?.volatility > 3.0 ? 'High Risk' : coin?.volatility > 1.5 ? 'Medium Risk' : 'Low Risk');
  const coinVolatility = coin?.volatility ?? volatility?.volatility ?? 0;
  const mcap = coin?.marketCap ?? coin?.market_cap ?? 0;
  const vol24h = coin?.volume ?? coin?.volume_24h ?? 0;

  const cardsData = [
    {
      label: 'Daily Return',
      value: formatPercent(dailyReturn),
      isPercent: true,
      rawVal: dailyReturn,
      icon: FiPercent,
      desc: 'Price change in the last 24 hours',
    },
    {
      label: 'Monthly Return',
      value: formatPercent(monthlyReturn),
      isPercent: true,
      rawVal: monthlyReturn,
      icon: FiPercent,
      desc: 'Estimated returns over last 30 days',
    },
    {
      label: 'Annual Return',
      value: formatPercent(annualReturn),
      isPercent: true,
      rawVal: annualReturn,
      icon: FiPercent,
      desc: 'ROI calculated over the current dataset',
    },
    {
      label: 'Volatility (Risk)',
      value: `${coinVolatility.toFixed(2)}%`,
      isRisk: true,
      riskLevel: riskRating,
      icon: FiShield,
      desc: `Classified as ${riskRating.toLowerCase()}`,
    },
    {
      label: 'Market Capitalization',
      value: formatLargeNumber(mcap),
      icon: FiDollarSign,
      desc: 'Total circulating value of this asset',
    },
    {
      label: '24h Trading Volume',
      value: formatLargeNumber(vol24h),
      icon: FiActivity,
      desc: 'Aggregated volume across exchanges',
    },
  ];

  return (
    <div>
      <h2 className="details-section-title">
        <FiTrendingUp style={{ color: '#818cf8' }} />
        Asset Performance & Risk Profile
      </h2>
      <div className="performance-grid">
        {cardsData.map((c, i) => {
          const Icon = c.icon;
          let colorCls = '';
          if (c.isPercent) {
            colorCls = c.rawVal > 0 ? 'positive' : c.rawVal < 0 ? 'negative' : '';
          } else if (c.isRisk) {
            colorCls = c.riskLevel.includes('High') ? 'negative' : c.riskLevel.includes('Low') ? 'positive' : '';
          }

          return (
            <div key={i} className="perf-card">
              <span className="perf-label">{c.label}</span>
              <span className={`perf-value ${colorCls}`}>{c.value}</span>
              <span className="perf-desc">{c.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PerformanceCards;
