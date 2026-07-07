import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  BarChart,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, BarChart3, Activity, Zap } from 'lucide-react';
import { formatPrice, formatLargeNumber, formatPercent } from '../../utils/format';

const CHART_TYPES = [
  { id: 'area', label: 'Area', icon: <Activity size={16} /> },
  { id: 'line', label: 'Line', icon: <TrendingUp size={16} /> },
  { id: 'bar',  label: 'Bar',  icon: <BarChart3 size={16} /> },
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
            {entry.name.toLowerCase().includes('return') || entry.name.toLowerCase().includes('%')
              ? formatPercent(entry.value)
              : entry.name.toLowerCase().includes('price')
              ? formatPrice(entry.value)
              : formatLargeNumber(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

function extractTrenders(priceTrend) {
  const inner = priceTrend?.data;
  if (inner?.topTrenders && Array.isArray(inner.topTrenders)) return inner.topTrenders;
  if (inner?.data?.topTrenders && Array.isArray(inner.data.topTrenders)) return inner.data.topTrenders;
  if (Array.isArray(inner)) return inner;
  return [];
}

function extractArray(raw) {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

function buildPriceChartData(priceTrend, priceGrowth, priceDrop) {
  const trendCoins = extractTrenders(priceTrend).slice(0, 12);
  if (trendCoins.length > 0) {
    return trendCoins.map((coin) => ({
      name: coin?.symbol ?? coin?.name ?? '?',
      price: parseFloat(coin?.price ?? 0),
      marketCap: parseFloat(coin?.marketCap ?? 0),
      volume: parseFloat(coin?.volume ?? 0),
      dailyReturn: parseFloat(coin?.dailyReturn ?? 0),
    }));
  }
  return extractArray(priceGrowth).slice(0, 12).map((coin) => ({
    name: coin?.symbol ?? coin?.name ?? '?',
    price: parseFloat(coin?.price ?? 0),
    marketCap: parseFloat(coin?.marketCap ?? 0),
    volume: parseFloat(coin?.volume ?? 0),
    dailyReturn: parseFloat(coin?.dailyReturn ?? 0),
  }));
}

function buildGainersVsLosersData(priceGrowth, priceDrop) {
  const gainers = extractArray(priceGrowth).slice(0, 8);
  const losers  = extractArray(priceDrop).slice(0, 8);
  const data = [];
  const maxLen = Math.max(gainers.length, losers.length);
  for (let i = 0; i < maxLen; i++) {
    data.push({
      index: i + 1,
      gainerReturn: gainers[i] ? parseFloat(gainers[i].dailyReturn ?? 0) : null,
      loserReturn:  losers[i]  ? Math.abs(parseFloat(losers[i].dailyReturn ?? 0)) : null,
      gainerName:  gainers[i]?.symbol ?? `G${i+1}`,
      loserName:   losers[i]?.symbol  ?? `L${i+1}`,
    });
  }
  return data;
}

function MarketTrendChart({ priceTrend, priceGrowth, priceDrop }) {
  const [chartType, setChartType] = useState('area');
  const [mode, setMode] = useState('price');
  const [view, setView] = useState('market'); // 'market' | 'gainers'

  const marketData  = buildPriceChartData(priceTrend, priceGrowth, priceDrop);
  const glData      = buildGainersVsLosersData(priceGrowth, priceDrop);

  const sentiment = priceTrend?.data?.sentiment ?? priceTrend?.data?.data?.sentiment ?? 'neutral';
  const isBullish = sentiment === 'bullish';

  // Base premium colors: cyan, success green, light blue
  const baseColor = mode === 'price' ? '#00e5ff' : mode === 'marketCap' ? '#00ff9d' : '#38bdf8';
  const dataKey    = mode === 'price' ? 'price' : mode === 'marketCap' ? 'marketCap' : 'volume';
  const gradientId = `trend-gradient-${mode}`;

  const formatYAxis = (val) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
    return `$${parseFloat(val).toFixed(2)}`;
  };

  const renderMarketChart = () => {
    const commonProps = {
      data: marketData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };
    const xAxis = <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} tickLine={false} />;
    const yAxis = <YAxis tickFormatter={formatYAxis} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} width={72} />;
    const grid  = <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />;
    const tip   = <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 229, 255, 0.15)', strokeWidth: 1 }} />;
    const leg   = <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }} />;
    const name  = mode === 'price' ? 'Price' : mode === 'marketCap' ? 'Market Cap' : 'Volume';

    if (chartType === 'line') return (
      <LineChart {...commonProps}>
        {grid}{xAxis}{yAxis}{tip}{leg}
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={baseColor} 
          strokeWidth={3}
          dot={{ r: 4, fill: baseColor, strokeWidth: 0 }} 
          activeDot={{ r: 6, stroke: '#050816', strokeWidth: 2 }} 
          name={name} 
        />
      </LineChart>
    );
    if (chartType === 'bar') return (
      <BarChart {...commonProps}>
        {grid}{xAxis}{yAxis}{tip}{leg}
        <Bar dataKey={dataKey} fill={baseColor} radius={[6, 6, 0, 0]} name={name} maxBarSize={30} />
      </BarChart>
    );
    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={baseColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={baseColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        {grid}{xAxis}{yAxis}{tip}{leg}
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={baseColor} 
          strokeWidth={3}
          fill={`url(#${gradientId})`} 
          dot={false} 
          activeDot={{ r: 6, stroke: '#050816', strokeWidth: 2 }} 
          name={name} 
        />
      </AreaChart>
    );
  };

  const renderGainersChart = () => (
    <ComposedChart data={glData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
      <XAxis dataKey="index" tickFormatter={(v) => `#${v}`} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} tickLine={false} />
      <YAxis tickFormatter={(v) => `${v.toFixed(1)}%`} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} width={55} />
      <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4 2" />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.015)' }} />
      <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }} />
      <Bar dataKey="gainerReturn" fill="#00ff9d" radius={[5, 5, 0, 0]} name="Top Gain %" maxBarSize={28} />
      <Bar dataKey="loserReturn"  fill="#ff4d6d" radius={[5, 5, 0, 0]} name="Top Loss %" maxBarSize={28} />
    </ComposedChart>
  );

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="analytics-section-title">
              <TrendingUp className="section-title-icon" size={18} />
              Market Trends
            </h2>
            <p className="analytics-section-subtitle">
              Price, market cap, and volume trends — Sentiment:&nbsp;
              <span style={{ color: isBullish ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>
                {isBullish ? '🐂 Bullish' : '🐻 Bearish'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="analytics-chart-card">
        {/* View + Mode + Type Controls */}
        <div className="chart-controls">
          <div className="chart-mode-tabs">
            <button
              className={`chart-mode-btn ${view === 'market' ? 'active' : ''}`}
              onClick={() => setView('market')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Activity size={14} />
              <span>Market Overview</span>
            </button>
            <button
              className={`chart-mode-btn ${view === 'gainers' ? 'active' : ''}`}
              onClick={() => setView('gainers')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Zap size={14} />
              <span>Gainers vs Losers</span>
            </button>
          </div>

          {view === 'market' && (
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div className="chart-mode-tabs">
                {[
                  { id: 'price', label: 'Price' },
                  { id: 'marketCap', label: 'Mkt Cap' },
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
          )}
        </div>

        {/* Chart wrapper */}
        <div className="chart-wrapper">
          {(view === 'market' ? marketData : glData).length === 0 ? (
            <div className="analytics-empty">
              <BarChart3 size={40} className="text-muted" />
              <p>No trend data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              {view === 'gainers' ? renderGainersChart() : renderMarketChart()}
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketTrendChart;
