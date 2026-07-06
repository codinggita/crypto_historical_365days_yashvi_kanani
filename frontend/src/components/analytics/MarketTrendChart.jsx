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
import { FiTrendingUp, FiBarChart2, FiActivity, FiZap } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent } from '../../utils/format';

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
  // API response shape: { statusCode, data: { sentiment, topTrenders: [...] }, message }
  const inner = priceTrend?.data;
  if (inner?.topTrenders && Array.isArray(inner.topTrenders)) return inner.topTrenders;
  // Fallback for wrapped response
  if (inner?.data?.topTrenders && Array.isArray(inner.data.topTrenders)) return inner.data.topTrenders;
  // If data itself is an array (direct array response)
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
  // Fallback to priceGrowth
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

  const displayData = view === 'gainers' ? glData : marketData;

  const dataKey    = mode === 'price' ? 'price' : mode === 'marketCap' ? 'marketCap' : 'volume';
  const baseColor  = mode === 'price' ? '#6366f1' : mode === 'marketCap' ? '#f59e0b' : '#10b981';

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
    const xAxis = <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />;
    const yAxis = <YAxis tickFormatter={formatYAxis} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={72} />;
    const grid  = <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />;
    const tip   = <Tooltip content={<CustomTooltip />} />;
    const leg   = <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />;
    const name  = mode === 'price' ? 'Price' : mode === 'marketCap' ? 'Market Cap' : 'Volume';

    if (chartType === 'line') return (
      <LineChart {...commonProps}>
        <defs>
          <linearGradient id="lgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={baseColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={baseColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}{xAxis}{yAxis}{tip}{leg}
        <Line type="monotone" dataKey={dataKey} stroke={baseColor} strokeWidth={2.5}
          dot={{ r: 4, fill: baseColor }} activeDot={{ r: 6 }} name={name} />
      </LineChart>
    );
    if (chartType === 'bar') return (
      <BarChart {...commonProps}>
        {grid}{xAxis}{yAxis}{tip}{leg}
        <Bar dataKey={dataKey} fill={baseColor} radius={[4, 4, 0, 0]} name={name} maxBarSize={40} />
      </BarChart>
    );
    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={baseColor} stopOpacity={0.35} />
            <stop offset="95%" stopColor={baseColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {grid}{xAxis}{yAxis}{tip}{leg}
        <Area type="monotone" dataKey={dataKey} stroke={baseColor} strokeWidth={2.5}
          fill="url(#aGrad)" dot={false} activeDot={{ r: 6, strokeWidth: 2 }} name={name} />
      </AreaChart>
    );
  };

  const renderGainersChart = () => (
    <ComposedChart data={glData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
      <XAxis dataKey="index" tickFormatter={(v) => `#${v}`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
      <YAxis tickFormatter={(v) => `${v.toFixed(1)}%`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={55} />
      <ReferenceLine y={0} stroke="var(--border-color)" strokeDasharray="4 2" />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
      <Bar dataKey="gainerReturn" fill="#10b981" radius={[4, 4, 0, 0]} name="Top Gain %" maxBarSize={36} />
      <Bar dataKey="loserReturn"  fill="#ef4444" radius={[4, 4, 0, 0]} name="Top Loss %" maxBarSize={36} />
    </ComposedChart>
  );

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="analytics-section-title">
              <FiTrendingUp className="section-title-icon" />
              Market Trends
            </h2>
            <p className="analytics-section-subtitle">
              Price, market cap, and volume trends — Sentiment:&nbsp;
              <span style={{ color: isBullish ? '#10b981' : '#ef4444', fontWeight: 700 }}>
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
            >
              <FiActivity style={{ marginRight: '0.25rem' }} />Market
            </button>
            <button
              className={`chart-mode-btn ${view === 'gainers' ? 'active' : ''}`}
              onClick={() => setView('gainers')}
            >
              <FiZap style={{ marginRight: '0.25rem' }} />Gainers vs Losers
            </button>
          </div>

          {view === 'market' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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

        {/* Chart */}
        <div className="chart-wrapper">
          {(view === 'market' ? marketData : glData).length === 0 ? (
            <div className="analytics-empty">
              <FiBarChart2 size={40} />
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
