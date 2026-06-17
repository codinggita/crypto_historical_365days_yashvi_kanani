/**
 * Chart configuration constants used across all Recharts components
 */

export const CHART_COLORS = {
  primary:   '#6366f1',
  accent:    '#f59e0b',
  success:   '#10b981',
  danger:    '#ef4444',
  blue:      '#3b82f6',
  purple:    '#a855f7',
  pink:      '#ec4899',
  teal:      '#14b8a6',
  orange:    '#f97316',
  gray:      '#6b7280',
};

export const CHART_PALETTE = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#a855f7',
  '#14b8a6',
  '#f97316',
  '#ec4899',
  '#84cc16',
];

export const CHART_DEFAULTS = {
  height: 300,
  margin: { top: 5, right: 20, left: 10, bottom: 5 },
  strokeWidth: 2,
  dotRadius: 3,
  activeDotRadius: 5,
  animationDuration: 800,
};

export const CHART_GRID_STYLE = {
  strokeDasharray: '3 3',
  stroke: 'rgba(255,255,255,0.06)',
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'rgba(17,24,39,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#f3f4f6',
    fontSize: '0.85rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  labelStyle: { color: '#9ca3af', marginBottom: '4px' },
};

export const AXIS_STYLE = {
  tick: { fill: '#6b7280', fontSize: 11 },
  axisLine: false,
  tickLine: false,
};
