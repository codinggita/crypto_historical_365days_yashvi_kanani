import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { FiBarChart2, FiArrowUpRight, FiZap } from 'react-icons/fi';
import { formatLargeNumber, formatPrice, getCoinInitials } from '../../utils/format';

const VolumeTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="analytics-tooltip-row">
          <span className="analytics-tooltip-dot" style={{ backgroundColor: entry.color }} />
          <span className="analytics-tooltip-name">{entry.name}:</span>
          <span className="analytics-tooltip-value">{formatLargeNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

function extractCoins(raw) {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (raw?.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    // single coin
    return [raw.data];
  }
  return [];
}

function VolumeAnalytics({ highestVolume, lowestVolume, averageVolume, volumeSpike }) {
  const spikeCoins = extractCoins(volumeSpike).slice(0, 8);

  const chartData = spikeCoins.length > 0
    ? spikeCoins.map((c) => ({
        name: c.symbol ?? c.name ?? '?',
        volume: parseFloat(c.volume ?? 0),
        marketCap: parseFloat(c.marketCap ?? 0),
      }))
    : [];

  const highestCoin = highestVolume?.data ?? highestVolume?.data?.data;
  const lowestCoin  = lowestVolume?.data  ?? lowestVolume?.data?.data;
  const avgVol      = averageVolume?.data?.averageVolume ?? averageVolume?.data?.data?.averageVolume;

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <h2 className="analytics-section-title">
          <FiBarChart2 className="section-title-icon" />
          Volume Analytics
        </h2>
        <p className="analytics-section-subtitle">
          Trading volume distribution — highest spikes, lowest activity, and market averages
        </p>
      </div>

      {/* Volume Summary Cards */}
      <div className="analytics-vol-summary">
        <div className="vol-metric-card">
          <span className="vol-metric-label">Highest Volume</span>
          <span className="vol-metric-coin">{highestCoin?.name ?? '—'}</span>
          <span className="vol-metric-value text-indigo">{formatLargeNumber(highestCoin?.volume)}</span>
        </div>
        <div className="vol-metric-card">
          <span className="vol-metric-label">Lowest Volume</span>
          <span className="vol-metric-coin">{lowestCoin?.name ?? '—'}</span>
          <span className="vol-metric-value text-red">{formatLargeNumber(lowestCoin?.volume)}</span>
        </div>
        <div className="vol-metric-card">
          <span className="vol-metric-label">Market Avg Volume</span>
          <span className="vol-metric-coin">All Assets</span>
          <span className="vol-metric-value text-amber">{formatLargeNumber(avgVol)}</span>
        </div>
      </div>

      {/* Volume Spike Chart */}
      <div className="analytics-chart-card" style={{ marginTop: '1.5rem' }}>
        <div className="analytics-chart-title">
          <FiZap className="section-title-icon" />
          Volume Spike Analysis
        </div>
        {chartData.length === 0 ? (
          <div className="analytics-empty">
            <FiBarChart2 size={36} />
            <p>No volume spike data available</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => formatLargeNumber(v).replace('$', '')}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip content={<VolumeTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} name="Volume" maxBarSize={48} />
                <Bar dataKey="marketCap" fill="#10b981" radius={[4, 4, 0, 0]} name="Market Cap" maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default VolumeAnalytics;
