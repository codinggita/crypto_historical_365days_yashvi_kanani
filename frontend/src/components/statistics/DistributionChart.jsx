import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  BarChart,
  PieChart,
  Area,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatLargeNumber, formatPrice } from '../../utils/format';

const PRESETS = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
};

const PIE_COLORS = [
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
];

const CustomTooltip = ({ active, payload, isCurrency, isVolume }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="statistics-tooltip">
      <p className="statistics-tooltip-label">{payload[0].name}</p>
      <div className="statistics-tooltip-row">
        <span className="statistics-tooltip-dot" style={{ backgroundColor: payload[0].fill ?? payload[0].color }} />
        <span className="statistics-tooltip-name">Value:</span>
        <span className="statistics-tooltip-value">
          {isCurrency
            ? formatPrice(payload[0].value)
            : isVolume
            ? formatLargeNumber(payload[0].value)
            : payload[0].value}
        </span>
      </div>
    </div>
  );
};

function DistributionChart({
  data = [],
  type = 'bar',
  color = 'indigo',
  dataKey = 'value',
  nameKey = 'name',
  isCurrency = false,
  isVolume = false,
  height = 300,
}) {
  const hexColor = PRESETS[color] || PRESETS.indigo;

  if (!data || data.length === 0) {
    return (
      <div className="statistics-chart-empty">
        <p>No statistics data available</p>
      </div>
    );
  }

  const formatYAxis = (val) => {
    if (isCurrency) return `$${parseFloat(val).toFixed(2)}`;
    if (isVolume) {
      if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
      if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
      if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
      return `$${val}`;
    }
    return val;
  };

  const renderChartContent = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 5 },
    };

    const xAxis = (
      <XAxis
        dataKey={nameKey}
        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
        tickLine={false}
        axisLine={false}
      />
    );

    const yAxis = (
      <YAxis
        tickFormatter={formatYAxis}
        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
        tickLine={false}
        axisLine={false}
        width={60}
      />
    );

    const grid = <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />;

    const tooltip = (
      <Tooltip
        content={<CustomTooltip isCurrency={isCurrency} isVolume={isVolume} />}
        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
      />
    );

    if (type === 'pie') {
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip isCurrency={isCurrency} isVolume={isVolume} />} />
          <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
        </PieChart>
      );
    }

    if (type === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id={`colorGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={hexColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={hexColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={hexColor}
            strokeWidth={2}
            fill={`url(#colorGrad-${color})`}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      );
    }

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={hexColor}
            strokeWidth={2.5}
            dot={{ r: 3, fill: hexColor }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      );
    }

    // Default to bar
    return (
      <BarChart {...commonProps}>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        <Bar
          dataKey={dataKey}
          fill={hexColor}
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    );
  };

  return (
    <div className="statistics-chart-container" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChartContent()}
      </ResponsiveContainer>
    </div>
  );
}

export default DistributionChart;
