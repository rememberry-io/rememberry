"use client";
import ReactFlow, {
  Background,
  Controls,
  NodeOrigin,
  Panel,
  ReactFlowProvider,
} from "reactflow";
import { shallow } from "zustand/shallow";

// we have to import the React Flow styles for it to work
import useStore, { RFState } from "@/components/Flow/FlowElements/store";
import "reactflow/dist/style.css";
import Flashcard from "@/components/Flow/FlashcardComponents/Flashcard";
import { Stack } from "@/components/Flow/StackComponents/Stack";
import { MainStack } from "@/components/Flow/StackComponents/MainStack";
import { useAddStack } from "@/components/Flow/addFlashcardsAndStacks";
import { Button } from "@/components/ui/button";
import FlashcardEdge from "@/components/Flow/FlashcardComponents/FlashcardEdge";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
});

// this places the node origin in the center of a node
const nodeOrigin: NodeOrigin = [0.5, 0.5];

type NodeTypesType = {
  // any to bypass type checking
  [key: string]: React.ComponentType<any>;
};

const nodeTypes: NodeTypesType = {
  flashcard: Flashcard,
  stack: Stack,
  mainStack: MainStack,
};

const edgeTypes = {
  flashcard: FlashcardEdge,
  stack: FlashcardEdge,
};

function Map() {
  // whenever you use multiple values, you should use shallow to make sure the component only re-renders when one of the values changes
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(
    selector,
    shallow,
  );

  return (
    <div
    style={{ height: "100vh", width: "100vw" }}
    className="flex flex-col justify-items-center">
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeOrigin={nodeOrigin}
      nodeTypes={nodeTypes}
      fitView
    >
       <Background />
       <Panel position="bottom-center" className="space-x-4">
          <Button onClick={useAddStack}>Add Stack</Button>
          
        </Panel>
      <Controls />
    </ReactFlow>
    </div>
  );
}

export default function MapFlow() {
  return (
    <ReactFlowProvider>
      <Map />
    </ReactFlowProvider>
  );
}
