import React from 'react';
import { Settings, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

const ThresholdSettings = ({ thresholds, setThresholds }) => {
  const handleChange = (type, val) => {
    setThresholds(prev => ({
      ...prev,
      [type]: parseFloat(val)
    }));
  };

  return (
    <div className="threshold-settings card">
      <div className="settings-header">
        <Settings size={20} className="icon" />
        <h3 className="settings-title">Gas Threshold Engine</h3>
      </div>
      
      <div className="settings-grid">
        <div className="setting-item">
          <div className="label-row">
            <ShieldCheck size={16} className="safe" />
            <span className="label">Warning Threshold</span>
            <span className="value safe">{thresholds.warning.toFixed(1)}V</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1"
            value={thresholds.warning} 
            onChange={(e) => handleChange('warning', e.target.value)}
            className="threshold-slider warning-slider"
          />
        </div>

        <div className="setting-item">
          <div className="label-row">
            <AlertTriangle size={16} className="danger" />
            <span className="label">Danger Threshold</span>
            <span className="value danger">{thresholds.danger.toFixed(1)}V</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1"
            value={thresholds.danger} 
            onChange={(e) => handleChange('danger', e.target.value)}
            className="threshold-slider danger-slider"
          />
        </div>
      </div>

      <div className="threshold-indicator">
        <div className="bar safe" style={{ width: `${(thresholds.warning / 5) * 100}%` }}>Safe</div>
        <div className="bar warning" style={{ width: `${((thresholds.danger - thresholds.warning) / 5) * 100}%` }}>Warn</div>
        <div className="bar danger" style={{ width: `${((5 - thresholds.danger) / 5) * 100}%` }}>Alert</div>
      </div>

      <style jsx>{`
        .threshold-settings { padding: 1.5rem; background: var(--bg-card); border-radius: 12px; }
        .settings-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .settings-title { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .settings-grid { display: flex; flex-direction: column; gap: 1.5rem; }
        .label-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .label { font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); flex-grow: 1; }
        .value { font-weight: 700; font-size: 0.9rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(255,255,255,0.05); }
        
        .threshold-slider { width: 100%; height: 6px; border-radius: 3px; -webkit-appearance: none; background: #334155; }
        .threshold-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--primary); cursor: pointer; border: 2px solid #fff; }
        
        .safe { color: var(--accent-safe); }
        .warning { color: var(--accent-warning); }
        .danger { color: var(--accent-danger); }
        
        .threshold-indicator { display: flex; height: 24px; margin-top: 2rem; border-radius: 12px; overflow: hidden; font-size: 0.7rem; font-weight: bold; color: #fff; text-align: center; line-height: 24px; border: 1px solid rgba(255,255,255,0.1); }
        .bar.safe { background: rgba(6, 182, 212, 0.3); }
        .bar.warning { background: rgba(245, 158, 11, 0.3); }
        .bar.danger { background: rgba(239, 68, 68, 0.3); }
      `}</style>
    </div>
  );
};

export default ThresholdSettings;
