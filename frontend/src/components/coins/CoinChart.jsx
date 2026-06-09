import React from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatLargeNumber, formatDate } from '../../utils/format';
import { FiTrendingUp, FiActivity, FiDollarSign } from 'react-icons/fi';

const CHART_MODES = [
  { value: 'price',     label: 'Price',      icon: FiDollarSign },
  { value: 'marketCap', label: 'Market Cap', icon: FiTrendingUp },
  { value: 'volume',    label: 'Volume',     icon: FiActivity },
];

const CHART_TYPES = [
  { value: 'area', label: 'Area' },
  { value: 'line', label: 'Line' },
];

function CustomTooltip({ active, payload, label, mode }) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const date = payload[0].payload.timestamp;
    
    let formattedVal = '';
    if (mode === 'price') {
      formattedVal = formatCurrency(val, val < 1 ? 6 : 2);
    } else {
      formattedVal = formatLargeNumber(val);
    }

    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {formatDate(date)}
        </p>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: "'Roboto Mono', monospace" }}>
          {formattedVal}
        </p>
      </div>
    );
  }
  return null;
}

function CoinChart({ data, mode, type, onModeChange, onTypeChange }) {
  const chartData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({
      ...d,
      price: d.price ?? d.close ?? d.open ?? 0,
      marketCap: d.marketCap ?? d.market_cap ?? 0,
      volume: d.volume ?? d.volume_24h ?? 0,
      formattedDate: d.timestamp ? new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—',
    }));
  }, [data]);

  const valueKey = mode;
  const gradientId = `chart-gradient-${mode}`;

  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={chartData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="formattedDate"
            stroke="rgba(255,255,255,0.3)"
            fontSize={11}
            tickLine={false}
            dy={10}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-5}
            tickFormatter={(v) => (mode === 'price' ? (v < 1 ? `$${v.toFixed(3)}` : `$${v.toLocaleString()}`) : formatLargeNumber(v))}
          />
          <Tooltip content={<CustomTooltip mode={mode} />} />
          <Line
            type="monotone"
            dataKey={valueKey}
            stroke="#818cf8"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }}
            name={mode === 'price' ? 'Price' : mode === 'marketCap' ? 'Market Cap' : 'Volume'}
          />
        </LineChart>
      );
    }

    return (
      <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="formattedDate"
          stroke="rgba(255,255,255,0.3)"
          fontSize={11}
          tickLine={false}
          dy={10}
          axisLine={false}
        />
        <YAxis
          stroke="rgba(255,255,255,0.3)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dx={-5}
          tickFormatter={(v) => (mode === 'price' ? (v < 1 ? `$${v.toFixed(3)}` : `$${v.toLocaleString()}`) : formatLargeNumber(v))}
        />
        <Tooltip content={<CustomTooltip mode={mode} />} />
        <Area
          type="monotone"
          dataKey={valueKey}
          stroke="#818cf8"
          strokeWidth={2.5}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }}
          name={mode === 'price' ? 'Price' : mode === 'marketCap' ? 'Market Cap' : 'Volume'}
        />
      </AreaChart>
    );
  };

  return (
    <div className="chart-card-container">
      <div className="chart-header-row">
        {/* Metric tabs */}
        <div className="chart-title-tabs">
          {CHART_MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                id={`chart-mode-tab-${m.value}`}
                className={`chart-tab-btn${mode === m.value ? ' active' : ''}`}
                onClick={() => onModeChange(m.value)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Icon style={{ fontSize: '0.85rem' }} />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Type / Design controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="chart-type-toggles">
            {CHART_TYPES.map((t) => (
              <button
                key={t.value}
                id={`chart-type-btn-${t.value}`}
                className={`chart-type-btn${type === t.value ? ' active' : ''}`}
                onClick={() => onTypeChange(t.value)}
                style={{ fontSize: '0.75rem', fontWeight: 700 }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Recharts container */}
      <div className="chart-wrapper">
        {chartData.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted-layout)', fontSize: '0.9rem' }}>
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default CoinChart;
