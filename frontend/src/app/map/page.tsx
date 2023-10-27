"use client";
import { Flashcard } from "@/_components/Flow/FlashcardComponents/Flashcard";
import initialEdges from "@/_components/Flow/FlowElements/edges";
import initialNodes from "@/_components/Flow/FlowElements/nodes";
import { DropDown } from "@/_components/Flow/FlowHeader/DropDown";
import { MainStack } from "@/_components/Flow/StackComponents/MainStack";
import { Stack } from "@/_components/Flow/StackComponents/Stack";
import {
  useAddFlashcard,
  useAddStack,
} from "@/_components/Flow/addFlashcardsAndStacks";
import { Button } from "@/_components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
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
    <div className="flex">
      <div
        style={{ height: "90vh", width: "100vw" }}
        className="flex flex-col justify-items-center"
      >
        <div>
          <div className="flex flex-row items-center justify-around">
            <Link href="/map/menu">
              <Button variant="ghost">
                <ArrowLeftCircle className="mr-2" />
                Back to menu
              </Button>
            </Link>
            <MainStack
              frontText={frontText}
              backText={backText}
              toggleMainStack={toggleMainStack}
              isFront={isFront}
            />
            <DropDown />
          </div>
        </div>
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
            {/* <Button onClick={() => onLayout("LR")}>Horizontal Layout</Button>
            <Button onClick={() => onLayout("TB")}>Vertical Layout</Button> */}
          </Panel>
          <Controls />
        </ReactFlow>
      </div>
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
