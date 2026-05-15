import React, { useMemo } from "react";
import { ReactFlow, Background, Controls, EdgeText } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeDefaults = {
  style: {
    padding: "10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    width: 120,
    textAlign: "center",
    color: "#f1f5f9",
    border: "1px solid #334155",
  },
};

const TopologyMap = ({ latest, thresholds }) => {
  const gasValue = latest?.gas || 0;
  const isDanger = gasValue > (thresholds?.danger || 4);

  const nodes = useMemo(
    () => [
      {
        id: "hub",
        data: { label: "Central Hub" },
        position: { x: 250, y: 0 },
        style: { ...nodeDefaults.style, background: "#4f46e5" },
      },
      {
        id: "esp",
        data: { label: "ESP-32" },
        position: { x: 250, y: 100 },
        style: { ...nodeDefaults.style, background: "#10b981" },
      },
      {
        id: "dht",
        data: { label: "DHT Sensor\n(Temp/Hum)" },
        position: { x: 50, y: 200 },
        style: { ...nodeDefaults.style, background: "#3b82f6" },
      },
      {
        id: "gas",
        data: { label: `Gas Sensor\n(${gasValue}V)` },
        position: { x: 180, y: 200 },
        style: {
          ...nodeDefaults.style,
          background: isDanger ? "#ef4444" : "#f59e0b",
          animation: isDanger ? "pulse-red 1s infinite" : "none",
        },
      },
      {
        id: "actuators",
        data: { label: "Actuators\n(Servo/LED)" },
        position: { x: 350, y: 200 },
        style: { ...nodeDefaults.style, background: "#8b5cf6" },
      },
    ],
    [gasValue, isDanger],
  );

  const edges = [
    { id: "e-hub-esp", source: "hub", target: "esp", animated: true },
    { id: "e-esp-dht", source: "esp", target: "dht" },
    { id: "e-esp-gas", source: "esp", target: "gas", animated: gasValue > 0 },
    { id: "e-esp-act", source: "esp", target: "actuators", animated: true },
  ];

  return (
    <div
      className="topology-container"
      style={{
        width: "100%",
        height: "400px",
        background: "rgba(15, 23, 42, 0.5)",
        borderRadius: "12px",
        border: "1px solid #334155",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        zoomOnScroll={false}
      >
        <Background color="#334155" variant="dots" />
        <Controls />
      </ReactFlow>

      <style jsx>{`
        @keyframes pulse-red {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            transform: scale(1);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default TopologyMap;
