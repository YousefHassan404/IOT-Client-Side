// components/DistanceChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DistanceChart({ readings }) {
  const data = readings.slice(-100).map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString(),
    distance: Number(r.distance)
  }));

  return (
    <div>
      <h3>Distance Trend</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="time" minTickGap={20} />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="distance" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}