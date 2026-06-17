import React, { useId } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
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
  CHART_COLORS,
} from '../../constants/chartConstants';

export function AreaChart({
  data,
  xKey = 'timestamp',
  yKey = 'value',
  strokeColor = CHART_COLORS.primary,
  fillColor = CHART_COLORS.primary,
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  strokeWidth = CHART_DEFAULTS.strokeWidth,
  xFormatter,
  yFormatter,
  showGrid = true,
  showLegend = false,
}) {
  const gradientId = useId();

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={margin}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
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
          {showLegend && <Legend verticalAlign="top" height={36} />}
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={`url(#${gradientId})`}
            activeDot={{ r: CHART_DEFAULTS.activeDotRadius, strokeWidth: 0, fill: strokeColor }}
            animationDuration={CHART_DEFAULTS.animationDuration}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChart;
