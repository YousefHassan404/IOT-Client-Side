// components/DashboardCards.js
import React from 'react';

export default function DashboardCards({ latest, avg, total }) {
  return (
    <div className="cards">
      <div className="card">
        <h4>آخر قراءة</h4>
        <p className="big">{latest ? `${latest.distance} cm` : '—'}</p>
        <small>{latest ? new Date(latest.timestamp).toLocaleString() : ''}</small>
      </div>
      <div className="card">
        <h4>متوسط آخر 10</h4>
        <p className="big">{avg ? `${avg} cm` : '—'}</p>
        <small>Realtime Average</small>
      </div>
      <div className="card">
        <h4>عدد القراءات المحفوظة</h4>
        <p className="big">{total}</p>
        <small>In-memory store</small>
      </div>
    </div>
  );
}