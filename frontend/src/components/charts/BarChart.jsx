import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
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

export function BarChart({
  data,
  xKey = 'name',
  yKey = 'value',
  fillColor = CHART_COLORS.primary,
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  xFormatter,
  yFormatter,
  showGrid = true,
  showLegend = false,
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={margin}>
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
          <Bar
            dataKey={yKey}
            fill={fillColor}
            radius={[4, 4, 0, 0]}
            animationDuration={CHART_DEFAULTS.animationDuration}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;
