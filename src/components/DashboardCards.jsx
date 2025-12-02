// components/DashboardCards.js
import React from 'react';

export default function DashboardCards({ latest, stats, total, deviceControls }) {
  const cards = [
    {
      title: 'Temperature',
      value: latest ? `${latest.temperature || 0}°C` : '—',
      subValue: `Average: ${stats.temperature || 0}°C`,
      type: 'temperature'
    },
    {
      title: 'Humidity',
      value: latest ? `${latest.humidity || 0}%` : '—',
      subValue: `Average: ${stats.humidity || 0}%`,
      type: 'humidity'
    },
    {
      title: 'Distance',
      value: latest ? `${latest.distance || 0} cm` : '—',
      subValue: `Average: ${stats.distance || 0} cm`,
      type: 'distance'
    },
    {
      title: 'Gas Level',
      value: latest ? `${latest.gas || 0} V` : '—',
      subValue: `Average: ${stats.gas || 0} V`,
      type: 'gas'
    },
    {
      title: 'LED Status',
      value: deviceControls?.led === 'on' ? 'ON' : 'OFF',
      subValue: 'Remote Control',
      type: 'led',
      status: deviceControls?.led === 'on' ? 'active' : 'inactive'
    },
    {
      title: 'Buzzer',
      value: deviceControls?.buzzer === 'on' ? 'ACTIVE' : 'INACTIVE',
      subValue: 'Remote Control',
      type: 'buzzer',
      status: deviceControls?.buzzer === 'on' ? 'active' : 'inactive'
    },
    {
      title: 'Servo Motor',
      value: deviceControls?.servo === 'enabled' ? 'ENABLED' : 'DISABLED',
      subValue: `Angle: ${deviceControls?.servoAngle || 0}°`,
      type: 'servo',
      status: deviceControls?.servo === 'enabled' ? 'active' : 'inactive'
    },
    {
      title: 'Total Readings',
      value: total.toLocaleString(),
      subValue: 'In-memory store',
      type: 'readings'
    }
  ];

  return (
    <div className="dashboard-cards">
      <div className="section-header">
        <h2 className="section-title">Sensor Dashboard</h2>
        <p className="section-subtitle">Real-time monitoring and control</p>
      </div>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`card card-${card.type} ${card.status ? `status-${card.status}` : ''}`}
          >
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-value">{card.value}</p>
              <p className="card-subtext">{card.subValue}</p>
            </div>
            <div className={`card-indicator ${card.status || ''}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}