import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { formatPercent, getCoinInitials } from '../../utils/format';

function extractList(raw) {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

const ReturnTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip-label">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="analytics-tooltip-row">
          <span className="analytics-tooltip-dot" style={{ background: e.color }} />
          <span className="analytics-tooltip-name">{e.name}:</span>
          <span className="analytics-tooltip-value">{formatPercent(e.value)}</span>
        </div>
      ))}
    </div>
  );
};

function ReturnsAnalytics({ topReturns, negativeReturns, cumulativeReturns }) {
  const topList  = Array.isArray(extractList(topReturns)) ? extractList(topReturns).slice(0, 8) : [];
  const negList  = Array.isArray(extractList(negativeReturns)) ? extractList(negativeReturns).slice(0, 8) : [];

  const cumulative = cumulativeReturns?.data ?? cumulativeReturns?.data?.data;
  const avgReturn  = cumulative?.averageDailyReturn ?? 0;
  const estMonthly = cumulative?.estimatedMonthlyReturn ?? avgReturn * 30;

  // Build chart data from top vs negative
  const chartData = Array.isArray(topList) ? topList.slice(0, 6).map((c, i) => ({
    name: c.symbol ?? c.name ?? `#${i + 1}`,
    topReturn: parseFloat(c.dailyReturn ?? 0),
    negReturn: negList[i] ? Math.abs(parseFloat(negList[i].dailyReturn ?? 0)) : 0,
  })) : [];

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <h2 className="analytics-section-title">
          <FiTrendingUp className="section-title-icon" />
          Returns Analytics
        </h2>
        <p className="analytics-section-subtitle">
          Performance leaders, underperformers, and cumulative market returns
        </p>
      </div>

      {/* Cumulative Summary */}
      <div className="analytics-returns-summary">
        <div className="vol-metric-card">
          <span className="vol-metric-label">Avg Daily Return</span>
          <span className={`vol-metric-value ${parseFloat(avgReturn) >= 0 ? 'text-green' : 'text-red'}`}>
            {formatPercent(avgReturn)}
          </span>
        </div>
        <div className="vol-metric-card">
          <span className="vol-metric-label">Est. Monthly Return</span>
          <span className={`vol-metric-value ${parseFloat(estMonthly) >= 0 ? 'text-green' : 'text-red'}`}>
            {formatPercent(estMonthly)}
          </span>
        </div>
        <div className="vol-metric-card">
          <span className="vol-metric-label">Top Performers</span>
          <span className="vol-metric-value text-indigo">{topList.length}</span>
        </div>
        <div className="vol-metric-card">
          <span className="vol-metric-label">Underperformers</span>
          <span className="vol-metric-value text-red">{negList.length}</span>
        </div>
      </div>

      {/* Returns Chart */}
      <div className="analytics-chart-card" style={{ marginTop: '1.5rem' }}>
        <div className="analytics-chart-title">
          Returns Comparison — Top vs Negative
        </div>
        {chartData.length === 0 ? (
          <div className="analytics-empty">
            <FiTrendingUp size={36} />
            <p>No returns data available</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="retGradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="retGradRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `${v.toFixed(1)}%`}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                />
                <Tooltip content={<ReturnTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                <Area type="monotone" dataKey="topReturn" stroke="#10b981" strokeWidth={2.5} fill="url(#retGradGreen)" dot={false} name="Top Return %" />
                <Area type="monotone" dataKey="negReturn" stroke="#ef4444" strokeWidth={2.5} fill="url(#retGradRed)" dot={false} name="Neg Return %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Best/Worst List */}
      <div className="content-grid" style={{ marginTop: '1.5rem' }}>
        <div className="content-card">
          <h3 className="content-card-title">
            <FiArrowUpRight style={{ color: 'var(--positive)' }} />
            Best Performers
          </h3>
          <div className="placeholder-list">
            {topList.length === 0 && <p className="text-muted">No data</p>}
            {topList.map((coin, i) => (
              <div className="placeholder-row" key={coin.coinId ?? i}>
                <div className="placeholder-coin">
                  <div className="placeholder-coin-dot positive-bg">{getCoinInitials(coin.name, coin.symbol)}</div>
                  <div>
                    <div className="placeholder-coin-name">{coin.name}</div>
                    <div className="placeholder-coin-sym">{coin.symbol}</div>
                  </div>
                </div>
                <span className="placeholder-badge positive">{formatPercent(coin.dailyReturn)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="content-card">
          <h3 className="content-card-title">
            <FiArrowDownRight style={{ color: 'var(--negative)' }} />
            Worst Performers
          </h3>
          <div className="placeholder-list">
            {negList.length === 0 && <p className="text-muted">No data</p>}
            {negList.map((coin, i) => (
              <div className="placeholder-row" key={coin.coinId ?? i}>
                <div className="placeholder-coin">
                  <div className="placeholder-coin-dot negative-bg">{getCoinInitials(coin.name, coin.symbol)}</div>
                  <div>
                    <div className="placeholder-coin-name">{coin.name}</div>
                    <div className="placeholder-coin-sym">{coin.symbol}</div>
                  </div>
                </div>
                <span className="placeholder-badge negative">{formatPercent(coin.dailyReturn)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnsAnalytics;
