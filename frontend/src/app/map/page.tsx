"use client";
import "@/_components/Flow/Flashcard";
import { Flashcard } from "@/_components/Flow/Flashcard";
import "@/_components/Flow/Stack";
import { Stack } from "@/_components/Flow/Stack";
import { useCallback, useState } from "react";
import ReactFlow, { Background, Node, applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";

// as reactflow is written in TS -> types don't have to be included separately

type NodeTypesType = {
  // any to bypass type checking
  [key: string]: React.ComponentType<any>;
};

const nodeTypes: NodeTypesType = { flashcard: Flashcard, stack: Stack };

const initialNodes: Node[] = [
  {
    id: "1",
    type: "flashcard",
    position: { x: 600, y: 100 },
    data: {
      frontText: "What is your name?",
      backText: "Slim shady",
      category: "#1 - Cellular Structure",
    },
  },
  {
    id: "2",
    type: "stack",
    position: { x: 100, y: 100 },
    data: {
      frontText: "Cellular structure",
      backText:
        "biology branch that studies the structure, function, and behaviour of cells -> all living organisms are made of cells",
    },
  },
  {
    id: "3",
    type: "stack",
    position: { x: 200, y: 300 },
    data: {
      frontText: "Cellular structure",
      backText: "Cellular structurefsefe",
    },
  },
  {
    id: "4",
    type: "stack",
    position: { x: 200, y: 400 },
    data: {
      frontText: "Cellular structure",
      backText: "Cellular structurefefe",
    },
  },
  {
    id: "5",
    type: "flashcard",
    position: { x: 200, y: 500 },
    data: {
      frontText: "Explain the role of the cytoskeleton",
      backText: "fwjf",
      category: "#27 - Cellular Structure",
    },
  },
];

export const Map: React.FC = () => {
  const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);

  // applyChanges functions apply changes to current state of the element (either edge or node)
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  //   const onEdgesChange = useCallback(
  //     (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //     []
  //   );

  //   const onConnectHandler = useCallback(
  //     (params: any) => setEdges((eds) => addEdge(params, eds)),
  //     []
  //   );

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex justify-center items-center"
    >
      {/* <BackgroundCircle /> */}
      <ReactFlow
        nodes={nodes}
        // edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        // onEdgesChange={onEdgesChange}
        zoomOnPinch={false}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Map;
