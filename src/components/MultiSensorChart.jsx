// components/MultiSensorChart.js
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MultiSensorChart({ readings }) {
  const [activeSensors, setActiveSensors] = useState({
    distance: true,
    temperature: true,
    humidity: true,
    gas: true
  });

  const chartData = readings.slice(-100).map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    distance: Number(r.distance) || 0,
    temperature: Number(r.temperature) || 0,
    humidity: Number(r.humidity) || 0,
    gas: Number(r.gas) || 0,
    fullTime: new Date(r.timestamp)
  }));

  chartData.sort((a, b) => a.fullTime - b.fullTime);

  const toggleSensor = (sensor) => {
    setActiveSensors(prev => ({
      ...prev,
      [sensor]: !prev[sensor]
    }));
  };

  const sensorConfigs = {
    distance: { label: 'Distance', color: '#6366f1', unit: 'cm' },
    temperature: { label: 'Temperature', color: '#ef4444', unit: '°C' },
    humidity: { label: 'Humidity', color: '#3b82f6', unit: '%' },
    gas: { label: 'Gas Level', color: '#f59e0b', unit: 'V' }
  };

  return (
    <div className="multi-chart">
      <div className="chart-header">
        <div className="header-content">
          <h2 className="chart-title">Sensor Analytics</h2>
          <p className="chart-subtitle">Multi-sensor data visualization</p>
        </div>
        <div className="sensor-controls">
          <div className="sensor-toggles">
            {Object.entries(sensorConfigs).map(([key, config]) => (
              <button
                key={key}
                className={`sensor-toggle ${activeSensors[key] ? 'toggle-active' : ''}`}
                onClick={() => toggleSensor(key)}
                style={{
                  '--sensor-color': config.color,
                }}
              >
                <span className="toggle-dot"></span>
                <span className="toggle-label">{config.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              minTickGap={30}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#6b7280"
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value, name) => {
                const config = sensorConfigs[name.toLowerCase()];
                return [`${value} ${config?.unit || ''}`, config?.label || name];
              }}
            />
            <Legend />
            
            {activeSensors.distance && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="distance"
                stroke={sensorConfigs.distance.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: sensorConfigs.distance.color }}
              />
            )}
            
            {activeSensors.temperature && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke={sensorConfigs.temperature.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: sensorConfigs.temperature.color }}
              />
            )}
            
            {activeSensors.humidity && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                stroke={sensorConfigs.humidity.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: sensorConfigs.humidity.color }}
              />
            )}
            
            {activeSensors.gas && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="gas"
                stroke={sensorConfigs.gas.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: sensorConfigs.gas.color }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}