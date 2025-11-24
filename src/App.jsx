// App.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import DashboardCards from './components/DashboardCards';
import ReadingsTable from './components/ReadingsTable';
import DistanceChart from './components/DistanceChart';

const BACKEND = 'https://iot-server-side.fly.dev';
const SOCKET_URL = BACKEND;

export default function App() {
  const [readings, setReadings] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // initial fetch
    axios.get(`${BACKEND}/api/readings?n=200`)
      .then(res => {
        if (res.data && res.data.readings) setReadings(res.data.readings);
      })
      .catch(err => console.warn(err));

    // connect socket
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('connect', () => console.log('connected to socket'));
    socketRef.current.on('snapshot', arr => {
      setReadings(arr);
    });
    socketRef.current.on('reading', r => {
      setReadings(prev => {
        const next = [...prev, r].slice(-500);
        return next;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // compute summary
  const latest = readings[readings.length - 1] || null;
  const avgLast10 = (() => {
    const last = readings.slice(-10);
    if (!last.length) return null;
    return (last.reduce((s, x) => s + Number(x.distance), 0) / last.length).toFixed(2);
  })();

  return (
    <div className="app">
      <header className="header">
        <h1>Ultrasonic Dashboard</h1>
      </header>
      <main>
        <DashboardCards latest={latest} avg={avgLast10} total={readings.length} />
        <section className="layout">
          <div className="panel">
            <DistanceChart readings={readings} />
          </div>
          <div className="panel">
            <ReadingsTable readings={readings.slice().reverse().slice(0, 50)} />
          </div>
        </section>
      </main>
      <footer className="footer">
        <small>Built with MO and JO — ESP → Node/Socket.IO → React</small>
      </footer>
    </div>
  );
}