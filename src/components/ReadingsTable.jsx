// components/ReadingsTable.js
import React from 'react';

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
              <th>Humidity</th>
              <th>Gas</th>
              <th>LED</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}