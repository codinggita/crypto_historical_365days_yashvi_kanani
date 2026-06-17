import React from 'react';
import {
  LineChart as RechartsLineChart,
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
  CHART_COLORS,
} from '../../constants/chartConstants';

export function LineChart({
  data,
  xKey = 'timestamp',
  yKey = 'value',
  strokeColor = CHART_COLORS.primary,
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  strokeWidth = CHART_DEFAULTS.strokeWidth,
  dot = false,
  activeDot = { r: CHART_DEFAULTS.activeDotRadius, strokeWidth: 0 },
  xFormatter,
  yFormatter,
  showGrid = true,
  showLegend = false,
  legendAlign = 'center',
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={margin}>
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
          {showLegend && <Legend align={legendAlign} verticalAlign="top" height={36} />}
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dot={dot}
            activeDot={activeDot}
            animationDuration={CHART_DEFAULTS.animationDuration}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
