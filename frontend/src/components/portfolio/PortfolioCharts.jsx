import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import '../../styles/portfolio.css';

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function PortfolioCharts({ history }) {
  const [chartMode, setChartMode] = useState('growth'); // 'growth' | 'pnl'

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartData = (history || []).map((h) => {
    const monthStr = MONTH_NAMES[h.month] || `M${h.month}`;
    return {
      name: `${monthStr} ${h.year}`,
      Invested: h.invested || 0,
      Value: h.value || 0,
      ProfitLoss: h.profitLoss || 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'rgba(15, 18, 29, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.6rem 0.8rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
            {label}
          </p>
          {payload.map((item, index) => (
            <p
              key={index}
              style={{
                margin: '0.2rem 0 0 0',
                fontSize: '0.8rem',
                color: item.color || '#fff',
              }}
            >
              {item.name}:{' '}
              <span style={{ fontWeight: 600 }}>{formatCurrency(item.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div className="panel-header">
        <h2>Performance & Growth Trends</h2>
        <div className="portfolio-actions-header">
          <button
            className={`btn-secondary ${chartMode === 'growth' ? 'btn-primary' : ''}`}
            onClick={() => setChartMode('growth')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            Growth
          </button>
          <button
            className={`btn-secondary ${chartMode === 'pnl' ? 'btn-primary' : ''}`}
            onClick={() => setChartMode('pnl')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            P&L Trend
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="empty-state" style={{ border: 'none', padding: '4rem 0' }}>
          <p>No historical portfolio records found. Add transactions to build historical trends.</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
          {chartMode === 'growth' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Value"
                  name="Current Value"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
                <Area
                  type="monotone"
                  dataKey="Invested"
                  name="Total Invested"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorInvested)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="ProfitLoss" name="Net Profit/Loss">
                  {chartData.map((entry, index) => {
                    const isPositive = entry.ProfitLoss >= 0;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isPositive ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)'}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}

export default PortfolioCharts;
