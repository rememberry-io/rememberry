"use client";
import ReactFlow, { Background, Panel, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

const RememberryBackground: React.FC = () => {
  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <ReactFlow zoomOnPinch={false}>
        <Background className="  bg-white dark:bg-dark-900"  />
      
      </ReactFlow>
    </div>
  );
};

export default function FlowBackground() {
  return (
    <ReactFlowProvider>
      <RememberryBackground />
    </ReactFlowProvider>
  );
}
