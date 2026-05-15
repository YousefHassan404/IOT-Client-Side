import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

export default function MultiSensorChart({ readings }) {
  const [activeSensors, setActiveSensors] = useState({
    distance: true,
    temperature: true,
    humidity: true,
    gas: true
  });

  const chartData = readings.slice(-50).map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    distance: Number(r.distance) || 0,
    temperature: Number(r.temperature) || 0,
    humidity: Number(r.humidity) || 0,
    gas: Number(r.gas) || 0,
    fullTime: new Date(r.timestamp)
  }));

  chartData.sort((a, b) => a.fullTime - b.fullTime);

  // Predictive Forecasting Logic (5-step lookahead)
  const lastN = 10;
  if (chartData.length >= lastN) {
    const lastPoint = chartData[chartData.length - 1];
    const firstOfLast = chartData[chartData.length - lastN];
    
    // Simple slope calculation
    const gasSlope = (lastPoint.gas - firstOfLast.gas) / lastN;
    const tempSlope = (lastPoint.temperature - firstOfLast.temperature) / lastN;
    
    // Create connection point (duplicate last real point as first forecast point for visual continuity)
    const forecastStart = {
      ...lastPoint,
      time: lastPoint.time + ' (F)',
      gasForecast: lastPoint.gas,
      tempForecast: lastPoint.temperature,
      isForecast: true
    };
    chartData.push(forecastStart);

    for (let i = 1; i <= 5; i++) {
      const projectedGas = lastPoint.gas + (gasSlope * i);
      const projectedTemp = lastPoint.temperature + (tempSlope * i);
      
      chartData.push({
        time: `+${i}m`,
        gasForecast: projectedGas,
        tempForecast: projectedTemp,
        isForecast: true
      });
    }
  }

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

  // Find projected anomalies (Gas > 4V or Temp > 40°C)
  const anomalies = chartData.filter(d => d.isForecast && (d.gasForecast > 4 || d.tempForecast > 40));

  return (
    <div className="multi-chart">
      <div className="chart-header">
        <div className="header-content">
          <h2 className="chart-title">Sensor Analytics & Forecasting</h2>
          <p className="chart-subtitle">Real-time data with 5-minute trend projection</p>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              minTickGap={30}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#6b7280"
              fontSize={10}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              fontSize={10}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="#6b7280"
              fontSize={10}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
              formatter={(value, name) => {
                const configKey = name.toLowerCase().replace('forecast', '');
                const config = sensorConfigs[configKey];
                return [`${value.toFixed(2)} ${config?.unit || ''}`, name];
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
              <>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke={sensorConfigs.temperature.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tempForecast"
                  stroke={sensorConfigs.temperature.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Temp Forecast"
                />
              </>
            )}
            
            {activeSensors.humidity && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                stroke={sensorConfigs.humidity.color}
                strokeWidth={2}
                dot={false}
              />
            )}
            
            {activeSensors.gas && (
              <>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gas"
                  stroke={sensorConfigs.gas.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gasForecast"
                  stroke={sensorConfigs.gas.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Gas Forecast"
                />
              </>
            )}

            {anomalies.map((anomaly, idx) => (
              <ReferenceDot
                key={idx}
                yAxisId={anomaly.gasForecast > 4 ? "right" : "left"}
                x={anomaly.time}
                y={anomaly.gasForecast > 4 ? anomaly.gasForecast : anomaly.tempForecast}
                r={5}
                fill="#ef4444"
                stroke="none"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}