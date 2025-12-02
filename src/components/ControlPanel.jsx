// components/ControlPanel.js
import React, { useState } from 'react';

export default function ControlPanel({ deviceControls, onControl, sensorId }) {
  const [servoAngle, setServoAngle] = useState(deviceControls?.servoAngle || 90);

  const handleLedControl = (state) => {
    onControl(sensorId, 'led', state);
  };

  const handleBuzzerControl = (state) => {
    onControl(sensorId, 'buzzer', state);
  };

  const handleServoControl = (state) => {
    onControl(sensorId, 'servo', state);
  };

  const handleServoAngleChange = (angle) => {
    setServoAngle(angle);
    onControl(sensorId, 'servoAngle', parseInt(angle));
  };

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h2 className="panel-title">Control Panel</h2>
        <p className="panel-subtitle">Remote device control interface</p>
      </div>
      
      <div className="control-grid">
        {/* LED Control */}
        <div className="control-card">
          <div className="card-header">
            <div className="control-icon led-icon"></div>
            <h3 className="control-title">LED Control</h3>
          </div>
          <div className="control-buttons">
            <button
              className={`control-btn ${deviceControls?.led === 'on' ? 'btn-active' : ''}`}
              onClick={() => handleLedControl('on')}
            >
              Turn On
            </button>
            <button
              className={`control-btn ${deviceControls?.led === 'off' ? 'btn-active' : ''}`}
              onClick={() => handleLedControl('off')}
            >
              Turn Off
            </button>
          </div>
          <div className="status-display">
            <span className="status-label">Status:</span>
            <div className="status-indicator">
              <div className={`status-dot ${deviceControls?.led === 'on' ? 'dot-active' : ''}`}></div>
              <span className="status-text">
                {deviceControls?.led === 'on' ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Buzzer Control */}
        <div className="control-card">
          <div className="card-header">
            <div className="control-icon buzzer-icon"></div>
            <h3 className="control-title">Buzzer Control</h3>
          </div>
          <div className="control-buttons">
            <button
              className={`control-btn ${deviceControls?.buzzer === 'on' ? 'btn-active' : ''}`}
              onClick={() => handleBuzzerControl('on')}
            >
              On
            </button>
            <button
              className={`control-btn ${deviceControls?.buzzer === 'off' ? 'btn-active' : ''}`}
              onClick={() => handleBuzzerControl('off')}
            >
              Off
            </button>
            <button
              className="control-btn btn-secondary"
              onClick={() => handleBuzzerControl('beep')}
            >
              Beep
            </button>
          </div>
          <div className="status-display">
            <span className="status-label">Status:</span>
            <div className="status-indicator">
              <div className={`status-dot ${deviceControls?.buzzer === 'on' ? 'dot-active' : ''}`}></div>
              <span className="status-text">
                {deviceControls?.buzzer === 'on' ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Servo Control */}
        <div className="control-card">
          <div className="card-header">
            <div className="control-icon servo-icon"></div>
            <h3 className="control-title">Servo Motor</h3>
          </div>
          <div className="control-buttons">
            <button
              className={`control-btn ${deviceControls?.servo === 'enabled' ? 'btn-active' : ''}`}
              onClick={() => handleServoControl('enable')}
            >
              Enable
            </button>
            <button
              className={`control-btn ${deviceControls?.servo === 'disabled' ? 'btn-active' : ''}`}
              onClick={() => handleServoControl('disable')}
            >
              Disable
            </button>
          </div>
          
          <div className="slider-container">
            <div className="slider-header">
              <label className="slider-label">Angle Control</label>
              <span className="angle-value">{servoAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={servoAngle}
              onChange={(e) => handleServoAngleChange(e.target.value)}
              disabled={deviceControls?.servo !== 'enabled'}
              className="servo-slider"
            />
            <div className="angle-presets">
              {[0, 45, 90, 135, 180].map(angle => (
                <button
                  key={angle}
                  className="angle-btn"
                  onClick={() => handleServoAngleChange(angle)}
                  disabled={deviceControls?.servo !== 'enabled'}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>
          
          <div className="status-display">
            <span className="status-label">Status:</span>
            <div className="status-indicator">
              <div className={`status-dot ${deviceControls?.servo === 'enabled' ? 'dot-active' : ''}`}></div>
              <span className="status-text">
                {deviceControls?.servo === 'enabled' ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}