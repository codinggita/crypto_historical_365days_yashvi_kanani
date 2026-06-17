import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CHART_DEFAULTS,
  CHART_PALETTE,
  TOOLTIP_STYLE,
} from '../../constants/chartConstants';

export function PieChart({
  data,
  nameKey = 'name',
  valueKey = 'value',
  height = CHART_DEFAULTS.height,
  colors = CHART_PALETTE,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  legendAlign = 'right',
  legendVerticalAlign = 'middle',
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip {...TOOLTIP_STYLE} />
          {showLegend && (
            <Legend
              align={legendAlign}
              verticalAlign={legendVerticalAlign}
              layout={legendAlign === 'right' || legendAlign === 'left' ? 'vertical' : 'horizontal'}
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: '0.8rem', color: '#9ca3af' }}
            />
          )}
          <Pie
            data={data}
            nameKey={nameKey}
            dataKey={valueKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            animationDuration={CHART_DEFAULTS.animationDuration}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;
