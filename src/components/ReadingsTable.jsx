// components/ReadingsTable.js
import React from 'react';

export default function ReadingsTable({ readings }) {
  return (
    <div>
      <h3>آخر القراءات</h3>
      <table className="table">
        <thead>
          <tr>
            <th>الوقت</th>
            <th>Sensor</th>
            <th>Distance (cm)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((r, i) => (
            <tr key={i}>
              <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
              <td>{r.sensorId}</td>
              <td>{r.distance}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}