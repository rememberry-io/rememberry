"use client";
import { Flashcard } from "@/components/Flow/FlashcardComponents/Flashcard";
import initialEdges from "@/components/Flow/FlowElements/edges";
import initialNodes from "@/components/Flow/FlowElements/nodes";
import { FlowHeader } from "@/components/Flow/FlowHeader/FlowHeader";
import { MainStack } from "@/components/Flow/StackComponents/MainStack";
import { Stack } from "@/components/Flow/StackComponents/Stack";
import {
  useAddFlashcard,
  useAddStack,
} from "@/components/Flow/addFlashcardsAndStacks";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

// as reactflow is written in TS -> types don't have to be included separately

type NodeTypesType = {
  // any to bypass type checking
  [key: string]: React.ComponentType<any>;
};

const nodeTypes: NodeTypesType = {
  flashcard: Flashcard,
  stack: Stack,
  mainStack: MainStack,
};

const frontText = "1st year medicine @Charite";
const backText = "Jehfbsjhdbf";

const Map: React.FC = () => {
  const addFlashcard = useAddFlashcard();
  const addStack = useAddStack();
  const [nodes, setNodes] = useState(initialNodes);
  const [isFront, setIsFront] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMainStack = useCallback(() => {
    setIsFront((prevIsFront) => !prevIsFront);
  }, []);

  const [edges, setEdges] = useState(initialEdges);

  // applyChanges functions apply changes to current state of the element (either edge or node)
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnectHandler = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <FlowHeader isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        zoomOnPinch={true}
      >
        <Background />
        <Panel position="bottom-center" className="space-x-4">
          <Button onClick={addStack}>Add stack</Button>
          <Button onClick={addFlashcard}>Add Flashcard</Button>
           {/*<Button onClick={() => onLayout("LR")}>Horizontal Layout</Button>
            <Button onClick={() => onLayout("TB")}>Vertical Layout</Button> */}
        </Panel>
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default function MapFlow() {
  return (
    <ReactFlowProvider>
      <Map />
    </ReactFlowProvider>
  );
}
