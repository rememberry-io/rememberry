"use client";
import { DropDown } from "@/_components/Flow/DropDown";
import { Flashcard } from "@/_components/Flow/Flashcard";
import initialEdges from "@/_components/Flow/FlowElements/edges";
import initialNodes from "@/_components/Flow/FlowElements/nodes";
import { MainStack } from "@/_components/Flow/MainStack";
import { Stack } from "@/_components/Flow/Stack";
import { Button } from "@/_components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
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

  const backToMenu = () => {};

  return (
    <div className="flex">
      <div
        style={{ height: "100vh", width: "100vw" }}
        className="flex flex-col justify-items-center"
      >
        {/* <BackgroundCircle /> */}
        <div className="flex flex-row items-center justify-around">
          <Button variant="ghost" className="" onClick={backToMenu}>
            <ArrowLeftCircle className="mr-2" />
            Back to menu
          </Button>
          <MainStack
            frontText={frontText}
            backText={backText}
            toggleMainStack={toggleMainStack}
            isFront={isFront}
          />
          <DropDown />
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
        </ReactFlow>
      </div>
    </div>
  );
};

export default Map;
