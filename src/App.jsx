import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import DashboardCards from "./components/DashboardCards";
import ReadingsTable from "./components/ReadingsTable";
import MultiSensorChart from "./components/MultiSensorChart";
import ControlPanel from "./components/ControlPanel";
import ProjectOverview from "./components/ProjectOverview";
import SerialTerminal from "./components/SerialTerminal";
import TopologyMap from "./components/TopologyMap";
import ThresholdSettings from "./components/ThresholdSettings";
import * as XLSX from "xlsx";

const BACKEND = "https://iot-server-side-v1.fly.dev";
const SOCKET_URL = BACKEND;

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState("overview");
  const [thresholds, setThresholds] = useState({ warning: 2, danger: 4 });
  const [readings, setReadings] = useState([]);
  const [deviceControls, setDeviceControls] = useState({
    "esp-01": {
      led: "off",
      buzzer: "off",
      servo: "enabled",
      servoAngle: 90,
      lastUpdated: Date.now(),
    },
  });
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const socketRef = useRef();

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch readings
        const readingsRes = await axios.get(`${BACKEND}/api/readings?n=200`);
        if (readingsRes.data?.readings) {
          setReadings(readingsRes.data.readings);
        }

        // Fetch device controls
        const devicesRes = await axios.get(`${BACKEND}/api/devices`);
        if (devicesRes.data?.devices) {
          setDeviceControls(devicesRes.data.devices);
        }

        setConnectionStatus("connected");
      } catch (err) {
        console.warn("Error fetching initial data:", err);
        setConnectionStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Setup socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket");
      setConnectionStatus("connected");
    });

    socketRef.current.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socketRef.current.on("connect_error", () => {
      setConnectionStatus("error");
    });

    socketRef.current.on("snapshot", (arr) => {
      setReadings(arr);
    });

    socketRef.current.on("reading", (r) => {
      setReadings((prev) => {
        const next = [...prev, r].slice(-500);
        return next;
      });
    });

    socketRef.current.on("deviceUpdate", (data) => {
      setDeviceControls((prev) => ({
        ...prev,
        [data.sensorId]: data.controls,
      }));
    });

    socketRef.current.on("controlUpdate", (data) => {
      setDeviceControls((prev) => ({
        ...prev,
        [data.sensorId]: data.controls,
      }));
    });

    socketRef.current.on("devicesSnapshot", (devices) => {
      setDeviceControls(devices);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Function to send control commands
  const sendControlCommand = async (sensorId, command, value) => {
    // Optimistic Update
    setDeviceControls((prev) => ({
      ...prev,
      [sensorId]: {
        ...prev[sensorId],
        [command === "servoAngle" ? "servoAngle" : command]: value,
      },
    }));

    try {
      await axios.post(`${BACKEND}/api/control/${sensorId}/action`, {
        action: command,
        value: value,
      });

      // Also emit via socket for real-time update
      if (socketRef.current) {
        socketRef.current.emit("controlDevice", {
          sensorId,
          command,
          value,
        });
      }
    } catch (error) {
      console.error("Error sending control command:", error);
      alert("Failed to send control command");

      // Revert on error if needed (optional, but good for UX)
      // fetchInitialData(); // Or just let the next socket update fix it
    }
  };

  // Function to export data as Excel
  const exportToExcel = () => {
    if (readings.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare data for export
    const exportData = readings.map((r) => ({
      Time: new Date(r.timestamp).toLocaleString(),
      "Sensor ID": r.sensorId,
      "Distance (cm)": r.distance,
      "Temperature (°C)": r.temperature,
      "Humidity (%)": r.humidity,
      "Gas Level (V)": r.gas,
      "LED State": r.ledState,
      "Buzzer State": r.buzzerState,
      "Servo Enabled": r.servoEnabled ? "Yes" : "No",
      "Servo Angle": r.servoAngle,
      Status: r.status,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sensor Readings");

    // Generate Excel file
    const fileName = `sensor_data_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Calculate statistics
  const latest = readings[readings.length - 1] || null;

  const calculateStats = (key) => {
    const last10 = readings.slice(-10);
    if (last10.length === 0) return null;
    const sum = last10.reduce((acc, r) => acc + Number(r[key] || 0), 0);
    return (sum / last10.length).toFixed(2);
  };

  const stats = {
    distance: calculateStats("distance"),
    temperature: calculateStats("temperature"),
    humidity: calculateStats("humidity"),
    gas: calculateStats("gas"),
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#10b981";
      case "connecting":
        return "#f59e0b";
      case "disconnected":
        return "#ef4444";
      case "error":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Disconnected";
      case "error":
        return "Connection Error";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">Initializing Dashboard</h2>
          <p className="loading-subtitle">
            Loading sensor data and connections...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          {currentView === "dashboard" && (
            <div className="header-left">
              <h1 className="app-title">IoT Sensor Dashboard</h1>
              <p className="app-subtitle">
                Real-time monitoring and control system
              </p>
            </div>
          )}

          <div className="header-right">
            <div className="header-controls">
              {currentView === "dashboard" && (
                <div className="connection-status">
                  <div
                    className={`status-indicator ${connectionStatus === "connected" ? "connected" : ""}`}
                    style={
                      connectionStatus !== "connected"
                        ? { backgroundColor: getConnectionStatusColor() }
                        : {}
                    }
                  ></div>
                  <span className="status-text">
                    {getConnectionStatusText()}
                  </span>
                </div>
              )}

              <button
                className="btn btn-secondary theme-toggle"
                onClick={toggleTheme}
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {currentView === "dashboard" && (
                <button className="btn btn-secondary" onClick={exportToExcel}>
                  <span className="btn-icon">↓</span>
                  Export Data
                </button>
              )}
            </div>
          </div>
        </div>

        {currentView === "dashboard" && (
          <div className="header-meta">
            <div className="meta-item">
              <span className="meta-label">Data:</span>
              <span className="meta-value">{readings.length} readings</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Update:</span>
              <span className="meta-value">
                {latest ? new Date(latest.timestamp).toLocaleTimeString() : "—"}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Sensor ID:</span>
              <span className="meta-value">esp-01</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Dashboard:</span>
              <span className="meta-value">v2.0</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {currentView === "overview" ? (
          <ProjectOverview key="overview" />
        ) : (
          <motion.main
            className="app-main"
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dashboard Cards Section */}
            <section className="section">
              <DashboardCards
                latest={latest}
                stats={stats}
                total={readings.length}
                deviceControls={deviceControls["esp-01"]}
                thresholds={thresholds}
              />
            </section>

            {/* Control & Settings Section */}
            <section className="section">
              <div className="settings-panel-grid">
                <ControlPanel
                  deviceControls={deviceControls["esp-01"]}
                  onControl={sendControlCommand}
                  sensorId="esp-01"
                />
                <ThresholdSettings
                  thresholds={thresholds}
                  setThresholds={setThresholds}
                />
              </div>
            </section>

            {/* Charts and Data Section */}
            <div className="data-section">
              <div className="data-panel topology-panel">
                <h3 className="panel-title">System Architecture Topology</h3>
                <TopologyMap latest={latest} thresholds={thresholds} />
              </div>

              <div className="data-panel chart-panel">
                <MultiSensorChart readings={readings} />
              </div>

              <div className="data-panel table-panel">
                <ReadingsTable
                  readings={readings.slice().reverse().slice(0, 50)}
                />
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {currentView === "dashboard" && <SerialTerminal readings={readings} />}

      {/* Floating Tab */}
      <div
        className="floating-tab"
        onClick={() =>
          setCurrentView(currentView === "overview" ? "dashboard" : "overview")
        }
      >
        <span className="tab-text">
          {currentView === "overview" ? "Live Dashboard" : "Project Overview"}
        </span>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-text">
              IoT Monitoring System • Real-time Dashboard • Version 2.0
            </p>
          </div>
          <div className="footer-right">
            <p className="footer-text">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
