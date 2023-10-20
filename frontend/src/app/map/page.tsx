"use client";
import { Flashcard } from "@/_components/Flow/Flashcard";
import { Stack } from "@/_components/Flow/Stack";
import { MainStack } from "@/_components/Flow/MainStack"
import { Button } from "@/_components/ui/button";
import { useCallback, useState } from "react";
import ReactFlow, { Background, Node, applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeftCircle } from 'lucide-react';
import { DropDown } from "@/_components/Flow/DropDown";

// as reactflow is written in TS -> types don't have to be included separately

type NodeTypesType = {
  // any to bypass type checking
  [key: string]: React.ComponentType<any>;
};

const frontText = "1st year medicine @Charite";
const backText = "Jehfbsjhdbf";

const nodeTypes: NodeTypesType = { flashcard: Flashcard, stack: Stack, mainStack: MainStack };

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
      backText: "Set a value as an array and Motion will animate through each of these values in turn. By default, each keyframe will be spaced evenly throughout the animation, but the exact timing and easing can be configured via the transition property turn. By default, each keyframe will be spaced evenly throughout the animation, but the exact timing and easing can be configured via the transition property.",
      category: "#27 - Cellular Structure",
    },
  },
];

const Map: React.FC = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [isFront, setIsFront] = useState(true);

const toggleMainStack = useCallback(() => {
		setIsFront((prevIsFront) => !prevIsFront)
	}, []);

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
	<div className="flex">
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
	  >
      {/* <BackgroundCircle /> */}
      <ReactFlow
        nodes={nodes}
        // edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        // onEdgesChange={onEdgesChange}
        zoomOnPinch={true}
		>
		<div className="flex flex-row items-center justify-around">
			<Button variant="ghost" className="">
				<ArrowLeftCircle className="mr-2"/>
				Back to menu
			</Button>
			<MainStack frontText={frontText} backText={backText} toggleMainStack={toggleMainStack} isFront={isFront}/>
			<DropDown />
		</div>
        <Background />
      </ReactFlow>
    </div>
	</div>
  );
};

export default Map;
