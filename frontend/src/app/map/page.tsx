"use client";
import ReactFlow, {
  Background,
  ConnectionLineType,
  Controls,
  MiniMap,
  Node,
  NodeOrigin,
  OnConnectEnd,
  OnConnectStart,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import { shallow } from "zustand/shallow";

// we have to import the React Flow styles for it to work
import Flashcard from "@/components/Flow/FlashcardComponents/Flashcard";
import FlashcardEdge from "@/components/Flow/FlashcardComponents/FlashcardEdge";
import useStore, { RFState } from "@/components/Flow/FlowElements/nodeStore";
import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState } from "react";
import "reactflow/dist/style.css";

// we need to import the React Flow styles to make it work
import { FlowHeader } from "@/components/Flow/FlowHeader/FlowHeader";
import { useAddStack } from "@/components/Flow/addStacks";
import "reactflow/dist/style.css";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const nodeTypes = {
  flashcard: Flashcard,
  stack: Flashcard,
};

const edgeTypes = {
  flashcard: FlashcardEdge,
  stack: FlashcardEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

function Map() {
  const store = useStoreApi();
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
    selector,
    shallow,
  );
  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);
  const [isFront, setIsFront] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [openDialogForNode, setOpenDialogForNode] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getChildNodePosition = (event: MouseEvent, parentNode?: Node) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }

    const { top, left } = domNode.getBoundingClientRect();

    // remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = screenToFlowPosition({
      x: event.clientX - left,
      y: event.clientY - top,
    });

    // calculating with positionAbsolute here because child nodes are positioned relative to their parent
    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    // remember where the connection started so we can add the new node to the correct parent on connect end
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane",
      );
      const node = (event.target as Element).closest(".react-flow__node");
      if (node) {
        node.querySelector("input")?.focus({ preventScroll: true });
      } else if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(
          event as MouseEvent,
          parentNode,
        );

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [getChildNodePosition],
  );

  const addStack = useAddStack();

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <FlowHeader isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={nodeOrigin}
        connectionLineType={ConnectionLineType.Straight}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls showInteractive={false} />
        <Panel position="bottom-center" className="space-x-4">
          <Button onClick={addStack}>Add Stack</Button>
        </Panel>
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
