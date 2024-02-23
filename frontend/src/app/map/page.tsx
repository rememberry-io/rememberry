"use client";
import toast, { Toaster } from "react-hot-toast";
import ReactFlow, {
  ConnectionLineType,
  Controls,
  Node,
  NodeOrigin,
  OnConnectEnd,
  OnConnectStart,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import { shallow } from "zustand/shallow";

// we have to import the React Flow styles for it to work
import FlashcardEdge from "@/components/Flow/CardComponents/FlashcardEdge";
import useStore, { RFState } from "@/components/Flow/stores/nodeStore";
import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState } from "react";
import "reactflow/dist/style.css";

// we need to import the React Flow styles to make it work
import FlowBackground from "@/components/Flow/Background/flowBackground";
import Card from "@/components/Flow/CardComponents/NodewithState";
import { NodeDialog } from "@/components/Flow/CustomComponents/NodeDialog";
import FlowFooter from "@/components/Flow/CustomComponents/flowFooter";
import { FlowHeader } from "@/components/Flow/Header/FlowHeader";
import { useAddStack } from "@/components/Flow/addStacks";
import "reactflow/dist/style.css";

const selector = (state: RFState) => state;

const nodeTypes = {
  flashcard: Card,
  stack: Card,
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
  const [nodeIdShownInDialog, setNodeIdShownInDialog] = useState<string | null>(
    null,
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const interceptOnNodesChange: typeof onNodesChange = (changes) => {
    console.log("nodes changed:", changes);
    if (changes.some((i) => i.type === "dimensions")) {
      // @ts-expect-error
      setNodeIdShownInDialog(changes[changes.length - 1].id);
      
    }

    return onNodesChange(changes);
  };
  const interceptOnEdgesChange: typeof onEdgesChange = (changes) => {
    console.log("edges changed:", changes);
    return onEdgesChange(changes);
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

      // setNodeIdShownInDialog(nodeId);

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(
          event as MouseEvent,
          parentNode,
        );

        //TODO: storybook implementation and separation of CardUI and CardWithState
        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [getChildNodePosition],
  );

  const addStack = useAddStack();

  const closeToast = () => {
    toast("Enter something first :)", {
      icon: "💡",
    });
  };

  const { updateNode } = useStore(
    (state) => ({ updateNode: state.updateNode }),
    shallow,
  );

  const handleDialogSubmit = (front: string, back: string, parent: string) => {
    updateNode(nodeIdShownInDialog!, front, back, parent, "red", false);
    setNodeIdShownInDialog(null);
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <FlowHeader isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* Node Dialog that gets thrown for input when node is created */}
      {nodeIdShownInDialog && (
        
        <NodeDialog
          nodeId={nodeIdShownInDialog}
          onSubmit={handleDialogSubmit}
          cardParentName={
            nodes.find((n) => n.id === nodeIdShownInDialog)?.data.parentName ||
            ""
          }
          cardFrontText={
            nodes.find((n) => n.id === nodeIdShownInDialog)?.data.frontText
          }
          cardBackText={
            nodes.find((n) => n.id === nodeIdShownInDialog)?.data.backText
          }
          isDialogOpen={nodeIdShownInDialog != null}
          closeDialog={() => setNodeIdShownInDialog(null)
        // TODO: set toast that opens if front or back text is empty  
        }
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={interceptOnNodesChange}
        onEdgesChange={interceptOnEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={nodeOrigin}
        onEdgesDelete={(e) => console.log("edge deleted", e)}
        fitView

        minZoom={0.1}
      >
        <FlowBackground />
        {/* <MiniMap /> */}
        <Controls showInteractive={false} />

        <FlowFooter>
          <Button
            variant="default"
            className="border-2 border-white dark:border-dark-900"
            onClick={addStack}
          >
            Add Stack
          </Button>
        </FlowFooter>
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
