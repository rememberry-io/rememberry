"use client";
import { DropDown } from "@/_components/Flow/DropDown";
import { Flashcard } from "@/_components/Flow/Flashcard";
import initialEdges from "@/_components/Flow/FlowElements/edges";
import initialNodes from "@/_components/Flow/FlowElements/nodes";
import { MainStack } from "@/_components/Flow/MainStack";
import { Stack } from "@/_components/Flow/Stack";
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
  useReactFlow,
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
let nodeId = 0;

const Map: React.FC = () => {
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

  const reactFlowInstance = useReactFlow();

  const addNode = useCallback(() => {
    const id = `${++nodeId}`;
    const newNode = {
      id: id,
      type: "flashcard",
      position: {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      },
      data: {
        frontText: "Front text",
        backText: "Back text",
        category: "Category",
      },
    };
    reactFlowInstance.addNodes(newNode);
  }, [reactFlowInstance]);

  return (
    <div className="flex">
      <div
        style={{ height: "90vh", width: "100vw" }}
        className="flex flex-col justify-items-center"
      >
        <div className="flex flex-row items-center justify-around ">
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
          {/* <Button className="ml-5 z-50" onClick={addNode}>
            Add Flashcard
          </Button> */}
          {/* <Button className="ml-5 z-50">Add Stack</Button> */}
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
            <Button>Add stack</Button>
            <Button onClick={addNode}>Add Flashcard</Button>
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
