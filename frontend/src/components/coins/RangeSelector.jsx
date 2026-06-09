import React from 'react';

const RANGES = [
  { value: '7',   label: '7D' },
  { value: '30',  label: '30D' },
  { value: '90',  label: '90D' },
  { value: '180', label: '180D' },
  { value: '365', label: '365D' },
  { value: 'all', label: 'ALL' },
];

function RangeSelector({ selected, onChange }) {
  return (
    <div className="range-selector" role="group" aria-label="Time range selector">
      {RANGES.map((r) => (
        <button
          key={r.value}
          id={`range-btn-${r.value}`}
          className={`range-btn${selected === r.value ? ' active' : ''}`}
          onClick={() => onChange(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default RangeSelector;
