import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

const SerialTerminal = ({ readings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const terminalRef = useRef(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (readings.length > 0) {
      const latest = readings[readings.length - 1];
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] DATA: ${JSON.stringify(latest)}`;
      setLogs(prev => [...prev, logEntry].slice(-100));
    }
  }, [readings]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`serial-terminal ${isOpen ? 'open' : 'closed'}`}>
      <div className="terminal-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-left">
          <TerminalIcon size={18} />
          <span>Raw Serial Terminal</span>
        </div>
        <div className="header-right">
          <button onClick={(e) => { e.stopPropagation(); setLogs([]); }} title="Clear Logs">
            <Trash2 size={16} />
          </button>
          {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="terminal-body" ref={terminalRef}>
          {logs.length === 0 ? (
            <div className="empty-msg">Waiting for data feed...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="log-line">
                <span className="log-msg">{log}</span>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .serial-terminal {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1000px;
          background: #0f172a;
          color: #38bdf8;
          border: 1px solid #334155;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          z-index: 1000;
          font-family: 'Fira Code', 'Courier New', monospace;
          transition: height 0.3s ease;
          overflow: hidden;
          box-shadow: 0 -10px 25px rgba(0,0,0,0.3);
        }
        .serial-terminal.closed { height: 40px; }
        .serial-terminal.open { height: 300px; }
        
        .terminal-header {
          height: 40px;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1e293b;
          cursor: pointer;
          user-select: none;
        }
        .header-left { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.9rem; }
        .header-right { display: flex; align-items: center; gap: 1rem; }
        .header-right button { background: none; border: none; color: #94a3b8; cursor: pointer; }
        .header-right button:hover { color: #f87171; }

        .terminal-body {
          height: 260px;
          padding: 1rem;
          overflow-y: auto;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .log-line { margin-bottom: 0.25rem; }
        .log-msg { white-space: pre-wrap; word-break: break-all; }
        .empty-msg { opacity: 0.5; font-style: italic; text-align: center; margin-top: 2rem; }
        
        .terminal-body::-webkit-scrollbar { width: 8px; }
        .terminal-body::-webkit-scrollbar-track { background: #0f172a; }
        .terminal-body::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default SerialTerminal;
