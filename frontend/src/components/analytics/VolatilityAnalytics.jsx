import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { FiAlertTriangle } from 'react-icons/fi';
import { formatPercent, getCoinInitials } from '../../utils/format';

function extractList(raw) {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

const VolTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip-label">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="analytics-tooltip-row">
          <span className="analytics-tooltip-dot" style={{ background: e.color }} />
          <span className="analytics-tooltip-name">Volatility:</span>
          <span className="analytics-tooltip-value">{formatPercent(e.value)}</span>
        </div>
      ))}
    </div>
  );
};

const RISK_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#6366f1'];

function getRiskLabel(volatility) {
  const v = parseFloat(volatility ?? 0);
  if (v >= 10) return { label: 'Extreme Risk', cls: 'risk-extreme' };
  if (v >= 5)  return { label: 'High Risk',    cls: 'risk-high' };
  if (v >= 2)  return { label: 'Medium Risk',  cls: 'risk-medium' };
  return            { label: 'Low Risk',      cls: 'risk-low' };
}

function VolatilityAnalytics({ highVolatility }) {
  const coins = Array.isArray(extractList(highVolatility)) ? extractList(highVolatility).slice(0, 10) : [];

  const chartData = coins.map((c) => ({
    name: c.symbol ?? c.name ?? '?',
    volatility: parseFloat(c.volatility ?? 0),
    fullName: c.name,
  }));

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <h2 className="analytics-section-title">
          <FiAlertTriangle className="section-title-icon" />
          Volatility Analysis
        </h2>
        <p className="analytics-section-subtitle">
          Risk assessment of the most volatile assets — higher volatility means higher risk and potential reward
        </p>
      </div>

      {/* Volatility Chart */}
      <div className="analytics-chart-card">
        <div className="analytics-chart-title">Volatility Leaderboard</div>
        {chartData.length === 0 ? (
          <div className="analytics-empty">
            <FiAlertTriangle size={36} />
            <p>No volatility data available</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `${v.toFixed(1)}%`}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip content={<VolTooltip />} />
                <Bar dataKey="volatility" radius={[4, 4, 0, 0]} name="Volatility %" maxBarSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Risk Leaderboard */}
      <div className="analytics-chart-card" style={{ marginTop: '1.5rem' }}>
        <div className="analytics-chart-title">Risk Classification</div>
        <div className="volatility-list">
          {coins.length === 0 && <p className="text-muted" style={{ padding: '1rem' }}>No data available</p>}
          {coins.map((coin, i) => {
            const risk = getRiskLabel(coin.volatility);
            const pct = Math.min((parseFloat(coin.volatility ?? 0) / 15) * 100, 100);
            return (
              <div className="volatility-row" key={coin.coinId ?? i}>
                <div className="vol-rank">#{i + 1}</div>
                <div className="vol-coin-info">
                  <span className="vol-coin-icon" style={{ background: RISK_COLORS[i % RISK_COLORS.length] }}>
                    {getCoinInitials(coin.name, coin.symbol)}
                  </span>
                  <div>
                    <div className="vol-coin-name">{coin.name}</div>
                    <div className="vol-coin-sym">{coin.symbol}</div>
                  </div>
                </div>
                <div className="vol-bar-wrap">
                  <div className="vol-bar-track">
                    <div
                      className="vol-bar-fill"
                      style={{ width: `${pct}%`, background: RISK_COLORS[i % RISK_COLORS.length] }}
                    />
                  </div>
                </div>
                <span className={`vol-risk-badge ${risk.cls}`}>{risk.label}</span>
                <span className="vol-value">{formatPercent(coin.volatility)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VolatilityAnalytics;
