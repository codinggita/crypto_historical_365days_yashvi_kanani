import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CHART_DEFAULTS,
  CHART_GRID_STYLE,
  TOOLTIP_STYLE,
  AXIS_STYLE,
  CHART_PALETTE,
} from '../../constants/chartConstants';

export function ComparisonChart({
  data,
  xKey = 'timestamp',
  keys = [], // array of string keys representing each compared asset (e.g., ['BTC', 'ETH'])
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  xFormatter,
  yFormatter,
  showGrid = true,
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margin}>
          {showGrid && <CartesianGrid {...CHART_GRID_STYLE} vertical={false} />}
          <XAxis
            dataKey={xKey}
            tickFormatter={xFormatter}
            {...AXIS_STYLE}
          />
          <YAxis
            tickFormatter={yFormatter}
            {...AXIS_STYLE}
          />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.8rem', color: '#9ca3af' }} />
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={CHART_PALETTE[index % CHART_PALETTE.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: CHART_DEFAULTS.activeDotRadius, strokeWidth: 0 }}
              animationDuration={CHART_DEFAULTS.animationDuration}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;
