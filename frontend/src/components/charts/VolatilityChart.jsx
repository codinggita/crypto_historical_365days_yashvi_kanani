import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  CHART_DEFAULTS,
  CHART_GRID_STYLE,
  TOOLTIP_STYLE,
  AXIS_STYLE,
  CHART_COLORS,
} from '../../constants/chartConstants';

export function VolatilityChart({
  data,
  xKey = 'timestamp',
  yKey = 'deviation', // deviation or daily return fluctuation
  height = CHART_DEFAULTS.height,
  margin = CHART_DEFAULTS.margin,
  xFormatter,
  yFormatter,
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={margin}>
          <CartesianGrid {...CHART_GRID_STYLE} vertical={false} />
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
          <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="3 3" />
          <Bar
            dataKey={yKey}
            fill={CHART_COLORS.danger}
            // Dynamic color based on deviation value (red for high risk, teal/indigo for low deviation)
            radius={[4, 4, 0, 0]}
            animationDuration={CHART_DEFAULTS.animationDuration}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VolatilityChart;
