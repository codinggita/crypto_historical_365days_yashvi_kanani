import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  BarChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { FiTrendingUp, FiBarChart2, FiActivity } from 'react-icons/fi';
import { formatPrice, formatLargeNumber } from '../../utils/format';

const CHART_TYPES = [
  { id: 'area', label: 'Area', icon: <FiActivity /> },
  { id: 'line', label: 'Line', icon: <FiTrendingUp /> },
  { id: 'bar',  label: 'Bar',  icon: <FiBarChart2 /> },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="analytics-tooltip-row">
          <span className="analytics-tooltip-dot" style={{ backgroundColor: entry.color }} />
          <span className="analytics-tooltip-name">{entry.name}:</span>
          <span className="analytics-tooltip-value">
            {entry.name.toLowerCase().includes('price')
              ? formatPrice(entry.value)
              : formatLargeNumber(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

function buildChartData(priceTrend, priceGrowth, priceDrop) {
  const trendCoins = Array.isArray(priceTrend?.data?.topTrenders ?? priceTrend?.data?.data?.topTrenders ?? [])
    ? (priceTrend?.data?.topTrenders ?? priceTrend?.data?.data?.topTrenders ?? [])
    : [];
  const growthCoins = Array.isArray(priceGrowth?.data)
    ? priceGrowth.data
    : Array.isArray(priceGrowth?.data?.data) ? priceGrowth.data.data : [];
  const dropCoins = Array.isArray(priceDrop?.data)
    ? priceDrop.data
    : Array.isArray(priceDrop?.data?.data) ? priceDrop.data.data : [];

  // Build unified chart data from trendCoins
  return trendCoins.slice(0, 10).map((coin, idx) => ({
    name: coin?.symbol ?? coin?.name ?? `Coin ${idx + 1}`,
    price: parseFloat(coin?.price ?? 0),
    marketCap: parseFloat(coin?.marketCap ?? 0),
    volume: parseFloat(coin?.volume ?? 0),
    dailyReturn: parseFloat(coin?.dailyReturn ?? 0),
  }));
}

function MarketTrendChart({ priceTrend, priceGrowth, priceDrop }) {
  const [chartType, setChartType] = useState('area');
  const [mode, setMode] = useState('price');

  const data = buildChartData(priceTrend, priceGrowth, priceDrop);

  const dataKey = mode === 'price' ? 'price' : mode === 'marketCap' ? 'marketCap' : 'volume';
  const color = mode === 'price' ? '#6366f1' : mode === 'marketCap' ? '#f59e0b' : '#10b981';

  const formatYAxis = (val) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };
    const xAxis = <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />;
    const yAxis = <YAxis tickFormatter={formatYAxis} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={72} />;
    const grid = <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />;
    const tooltip = <Tooltip content={<CustomTooltip />} />;
    const legend = <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />;

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {grid}{xAxis}{yAxis}{tooltip}{legend}
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} name={mode === 'price' ? 'Price' : mode === 'marketCap' ? 'Market Cap' : 'Volume'} />
        </LineChart>
      );
    }
    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          {grid}{xAxis}{yAxis}{tooltip}{legend}
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} name={mode === 'price' ? 'Price' : mode === 'marketCap' ? 'Market Cap' : 'Volume'} maxBarSize={40} />
        </BarChart>
      );
    }
    // area (default)
    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {grid}{xAxis}{yAxis}{tooltip}{legend}
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill="url(#areaGrad)" dot={false} activeDot={{ r: 6, strokeWidth: 2 }} name={mode === 'price' ? 'Price' : mode === 'marketCap' ? 'Market Cap' : 'Volume'} />
      </AreaChart>
    );
  };

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <h2 className="analytics-section-title">
          <FiTrendingUp className="section-title-icon" />
          Market Trends
        </h2>
        <p className="analytics-section-subtitle">
          Price, market cap, and volume trends across top performing assets
        </p>
      </div>

      <div className="analytics-chart-card">
        {/* Controls */}
        <div className="chart-controls">
          <div className="chart-mode-tabs">
            {[
              { id: 'price', label: 'Price' },
              { id: 'marketCap', label: 'Market Cap' },
              { id: 'volume', label: 'Volume' },
            ].map((m) => (
              <button
                key={m.id}
                className={`chart-mode-btn ${mode === m.id ? 'active' : ''}`}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="chart-type-tabs">
            {CHART_TYPES.map((t) => (
              <button
                key={t.id}
                className={`chart-type-btn ${chartType === t.id ? 'active' : ''}`}
                onClick={() => setChartType(t.id)}
                title={t.label}
              >
                {t.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="chart-wrapper">
          {data.length === 0 ? (
            <div className="analytics-empty">
              <FiBarChart2 size={40} />
              <p>No trend data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              {renderChart()}
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketTrendChart;
