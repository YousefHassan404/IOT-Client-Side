<<<<<<< HEAD
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const Sparkline = ({ data, color }) => {
  if (!data || data.length < 2) return <div style={{ width: '60px', height: '20px' }}></div>;
  const chartData = data.map((v, i) => ({ v: parseFloat(v) || 0, i }));
  
  return (
    <div style={{ width: '60px', height: '20px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="v" 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
=======
// components/ReadingsTable.js
import React from 'react';
>>>>>>> bdbfb70769a676b967b381a70d90cf82866e1e21

export default function ReadingsTable({ readings }) {
  return (
    <div className="readings-table">
      <div className="table-header">
        <div className="header-content">
          <h2 className="table-title">Sensor Readings</h2>
          <p className="table-subtitle">Recent data records</p>
        </div>
        <div className="table-info">
          <span className="record-count">{readings.length} records</span>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Sensor ID</th>
              <th>Distance</th>
              <th>Temperature</th>
<<<<<<< HEAD
              <th>Temp Trend</th>
              <th>Humidity</th>
              <th>Gas</th>
              <th>Gas Trend</th>
=======
              <th>Humidity</th>
              <th>Gas</th>
>>>>>>> bdbfb70769a676b967b381a70d90cf82866e1e21
              <th>LED</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
<<<<<<< HEAD
            {readings.map((r, i) => {
              // Get last 10 readings for trend (from this point backwards in the array)
              const trendRange = readings.slice(i, i + 10).reverse();
              const tempTrend = trendRange.map(tr => tr.temperature);
              const gasTrend = trendRange.map(tr => tr.gas);

              return (
                <tr key={i}>
                  <td className="timestamp-cell">
                    {new Date(r.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit' 
                    })}
                  </td>
                  <td>
                    <span className="sensor-id">{r.sensorId}</span>
                  </td>
                  <td className={`data-cell ${r.distance > 50 ? 'warning-cell' : ''}`}>
                    <span className="data-value">{r.distance}</span>
                    <span className="data-unit">cm</span>
                  </td>
                  <td className={`data-cell ${r.temperature > 30 ? 'warning-cell' : ''}`}>
                    <span className="data-value">{r.temperature}</span>
                    <span className="data-unit">°C</span>
                  </td>
                  <td>
                    <Sparkline data={tempTrend} color="#ef4444" />
                  </td>
                  <td className="data-cell">
                    <span className="data-value">{r.humidity}</span>
                    <span className="data-unit">%</span>
                  </td>
                  <td className={`data-cell ${r.gas > 2 ? 'danger-cell' : ''}`}>
                    <span className="data-value">{r.gas}</span>
                    <span className="data-unit">V</span>
                  </td>
                  <td>
                    <Sparkline data={gasTrend} color="#06b6d4" />
                  </td>
                  <td>
                    <div className={`status-badge ${r.ledState === 'on' ? 'badge-active' : 'badge-inactive'}`}>
                      {r.ledState === 'on' ? 'ON' : 'OFF'}
                    </div>
                  </td>
                  <td>
                    <div className={`status-badge ${r.status === 'OK' ? 'badge-success' : 'badge-error'}`}>
                      {r.status}
                    </div>
                  </td>
                </tr>
              );
            })}
=======
            {readings.map((r, i) => (
              <tr key={i}>
                <td className="timestamp-cell">
                  {new Date(r.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit' 
                  })}
                </td>
                <td>
                  <span className="sensor-id">{r.sensorId}</span>
                </td>
                <td className={`data-cell ${r.distance > 50 ? 'warning-cell' : ''}`}>
                  <span className="data-value">{r.distance}</span>
                  <span className="data-unit">cm</span>
                </td>
                <td className={`data-cell ${r.temperature > 30 ? 'warning-cell' : ''}`}>
                  <span className="data-value">{r.temperature}</span>
                  <span className="data-unit">°C</span>
                </td>
                <td className="data-cell">
                  <span className="data-value">{r.humidity}</span>
                  <span className="data-unit">%</span>
                </td>
                <td className={`data-cell ${r.gas > 2 ? 'danger-cell' : ''}`}>
                  <span className="data-value">{r.gas}</span>
                  <span className="data-unit">V</span>
                </td>
                <td>
                  <div className={`status-badge ${r.ledState === 'on' ? 'badge-active' : 'badge-inactive'}`}>
                    {r.ledState === 'on' ? 'ON' : 'OFF'}
                  </div>
                </td>
                <td>
                  <div className={`status-badge ${r.status === 'OK' ? 'badge-success' : 'badge-error'}`}>
                    {r.status}
                  </div>
                </td>
              </tr>
            ))}
>>>>>>> bdbfb70769a676b967b381a70d90cf82866e1e21
          </tbody>
        </table>
      </div>
    </div>
  );
}