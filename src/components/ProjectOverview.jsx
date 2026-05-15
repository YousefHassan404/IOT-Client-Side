import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectOverview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const description = "Welcome to the Smart Gas Detection and Monitoring System. This advanced IoT solution provides real-time monitoring of environmental factors including hazardous gas levels, temperature, and humidity. Utilizing a network of ESP-01 microcontrollers and high-precision sensors, the system ensures industrial safety through automated alerts, predictive forecasting, and remote actuator control. The central hub aggregates data to deliver actionable insights and immediate anomaly detection.";

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(description);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <motion.div 
      className="project-overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overview-content">
        <h1 className="overview-title">Smart Gas Detection & Monitoring</h1>
        <p className="overview-description">{description}</p>
        
        <button 
          className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'} speech-btn`}
          onClick={toggleSpeech}
        >
          {isPlaying ? <><Square size={18} /> Stop Audio</> : <><Play size={18} /> Listen to Overview</>}
        </button>
      </div>
      
      {/* <div className="overview-illustration">
        <div className="illustration-placeholder">
          <div className="illustration-graphic">
             <div className="circle-1"></div>
             <div className="circle-2"></div>
             <div className="circle-3"></div>
          </div>
          <p>System Architecture Illustration</p>
        </div>
      </div> */}
    </motion.div>
  );
}
