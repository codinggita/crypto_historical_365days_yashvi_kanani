import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '../../styles/portfolio.css';

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#ef4444', // Red
];

export function PortfolioAllocation({ distribution }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const chartData = (distribution || [])
    .map((item) => ({
      name: item.coinName || item.symbol,
      symbol: item.symbol,
      value: item.value || 0,
      percentage: item.percentage || 0,
    }))
    .filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.name} ({data.symbol})
          </p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Value: <span style={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(data.value)}</span>
          </p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Allocation:{' '}
            <span style={{ color: '#10b981', fontWeight: 600 }}>{data.percentage.toFixed(2)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel">
      <div className="panel-header">
        <h2>Portfolio Allocation</h2>
      </div>

      {chartData.length === 0 ? (
        <div className="empty-state" style={{ border: 'none', padding: '2rem 0' }}>
          <p>No holdings added yet. Allocation metrics will render once transactions exist.</p>
        </div>
      ) : (
        <div className="allocation-content">
          <div className="allocation-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="allocation-legend">
            {chartData.map((item, index) => (
              <div key={item.symbol} className="legend-item">
                <div className="legend-left">
                  <div
                    className="legend-color-dot"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <span className="legend-coin-symbol">{item.symbol}</span>
                    <span className="legend-coin-name" style={{ marginLeft: '0.4rem' }}>
                      {item.name}
                    </span>
                  </div>
                </div>
                <div className="legend-value-block">
                  <span className="legend-percentage">{item.percentage.toFixed(2)}%</span>
                  <div className="legend-value">{formatCurrency(item.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioAllocation;
