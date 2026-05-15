import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GasGauge = ({ value, min = 0, max = 5, thresholds = { warning: 2, danger: 4 } }) => {
  // Ensure value is numeric and within bounds
  const numValue = parseFloat(value) || 0;
  const normalizedValue = Math.min(Math.max(numValue, min), max);
  
  const data = [
    { value: normalizedValue },
    { value: max - normalizedValue }
  ];

  const getColor = (val) => {
    if (val >= thresholds.danger) return 'var(--accent-danger)';
    if (val >= thresholds.warning) return 'var(--accent-warning)';
    return 'var(--accent-safe)';
  };

  return (
    <div className="gas-gauge-container" style={{ width: '100%', height: '120px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={85}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor(normalizedValue)} />
            <Cell fill="rgba(255, 255, 255, 0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="gauge-value" style={{ 
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getColor(normalizedValue) }}>
          {numValue.toFixed(2)}
          <span style={{ fontSize: '0.8rem', marginLeft: '2px', opacity: 0.8 }}>V</span>
        </div>
      </div>
    </div>
  );
};

export default GasGauge;
