"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import NodeEdge from "@/components/Flow/CardComponents/NodeEdge";
import NodeWithState from "@/components/Flow/CardComponents/NodewithState";
import { NodeDialog } from "@/components/Flow/CustomComponents/NodeDialogState";
import FlowFooter from "@/components/Flow/CustomComponents/flowFooter";
import { FlowHeader } from "@/components/Flow/Header/FlowHeader";
import { Button } from "@/components/ui/button";
import useGetMapByUserId from "@/lib/services/maps/useGetMapsByUserId";
import { NodeData } from "@/lib/services/node/nodeStore";
import useNodeCreate, {
  databaseNodeToStoreNode,
  storeNodeToDatabaseNode,
} from "@/lib/services/node/useCreateNode";
import useGetNodesByMapId from "@/lib/services/node/useGetNodesByMapId";
import useNodeUpdate from "@/lib/services/node/useUpdateNode";
import { nanoid } from "nanoid/non-secure";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ReactFlow, {
  Controls,
  Edge,
  Node,
  NodeDragHandler,
  NodeOrigin,
  OnConnectEnd,
  OnConnectStart,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = {
  node: NodeWithState,
};

const edgeTypes = {
  node: NodeEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

type MapProps = {
  nodesProp: Node[];
  edgesProp: Edge[];
  mapId: string;
  mapName: string;
};

function Map({ nodesProp, edgesProp, mapId, mapName }: MapProps) {
  const reactflowStore = useStoreApi();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(nodesProp);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesProp);
  const [isOpen, setIsOpen] = useState(false);
  const [parentNodeId, setParentNodeId] = useState<string | null>(null);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreateNode, setCreateNode] = useState(false);
  const [xPosition, setXPosition] = useState(500);
  const [yPosition, setYPosition] = useState(500);
  const createNode = useNodeCreate();
  const updateNode = useNodeUpdate();

  //const deleteNode = useNodeDelete();

  useEffect(() => {
    if (nodes.length === 0) {
      setDialogOpen(true);
      setCreateNode(true);
    } else if (nodes.length > 0) {
      setDialogOpen(false);
      setCreateNode(false);
    }

    setNodes(nodesProp);
    setEdges(edgesProp);
  }, [nodesProp, setNodes, setEdges, edgesProp, nodes]);

  const onDragEnd: NodeDragHandler = async (_event, node, _nodes) => {
    const dbUpdatedNode = storeNodeToDatabaseNode(node);
    await updateNode({ node: dbUpdatedNode });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const getChildNodePosition = (event: MouseEvent, parentNode?: Node) => {
    const { domNode } = reactflowStore.getState();

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

    const x = panePosition.x;
    const y = panePosition.y + parentNode.height / 2;

    return {
      x,
      y,
    };
  };

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    // remember where the connection started so we can add the new node to the correct parent on connect end
    setConnectingNodeId(nodeId);
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = reactflowStore.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane",
      );

      if (targetIsPane && connectingNodeId) {
        const parentNode = nodeInternals.get(connectingNodeId);

        const childNodePosition = getChildNodePosition(
          event as MouseEvent,
          parentNode,
        );

        if (parentNode && childNodePosition) {
          setParentNodeId(parentNode.id);
          setXPosition(childNodePosition.x);
          setYPosition(childNodePosition.y);
          setDialogOpen(true);
          setCreateNode(true);
          console.log("creating new flaschard");
        }
      }
    },
    [getChildNodePosition],
  );

  const createNewNodeToMap = () => {
    const topLevelNode = nodes.find((n) => n.data.parentNodeId === null);
    setDialogOpen(true);
    setCreateNode(true);
    console.log("creating new map");
    setXPosition(topLevelNode ? topLevelNode.position.x + 350 : 500);
    setYPosition(topLevelNode?.position.y || 500);
    setParentNodeId(null);
  };

  const handleDialogSubmit = async (front: string, back: string) => {
    if (isCreateNode) {
      await createNode({
        node: {
          mapId: mapId,
          frontside: front,
          backside: back,
          xPosition,
          yPosition,
          nodeType: "flashcard",
          parentNodeId: parentNodeId ? parentNodeId : undefined,
        },
      });
      const parentNode = nodes.find((n) => n.id === parentNodeId);
      if (parentNode) {
        parentNode.data.nodeType = "stack";

        const dbParentNode = storeNodeToDatabaseNode(parentNode);
        await updateNode({ node: dbParentNode });
      }
    } else {
    }
    setParentNodeId(null);
  };

  console.log("id", mapId, "name", mapName, "nodes", nodes, "edges", edges);

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <FlowHeader
        mapName={mapName}
        openHandler={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* Node Dialog that gets thrown for input when node is created */}
      {dialogOpen && (
        <NodeDialog
          onSubmit={handleDialogSubmit}
          frontside={""}
          backside={""}
          isDialogOpen={dialogOpen}
          closeDialog={closeDialog}
        />
      )}

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
        onEdgesDelete={(e) => console.log("edge deleted", e)}
        fitView
        minZoom={0.1}
        onNodeDragStop={onDragEnd}
      >
        <FlowBackground />
        {/* <MiniMap /> */}
        <Controls showInteractive={false} />

        <FlowFooter>
          <Button
            variant="default"
            className="border-2 border-white dark:border-dark-900"
            onClick={createNewNodeToMap}
          >
            Add Stack
          </Button>
        </FlowFooter>
      </ReactFlow>
    </div>
  );
}

type MapParams = {
  params: { id: string };
};

export default function MapFlow({ params }: MapParams) {
  const { isLoading, data, isError } = useGetNodesByMapId(params.id);

  const { isLoading: mapLoading, maps } = useGetMapByUserId();

  if (isLoading || mapLoading) {
    return null;
  } else if (isError) {
    return null;
  }
  const edges = data.reduce<Edge[]>((acc, node) => {
    if (node.parentNodeId) {
      acc.push({
        id: nanoid(),
        source: node.parentNodeId,
        target: node.id,
      });
    }
    return acc;
  }, []);

  const reactFlowNodes = data.map((node) => databaseNodeToStoreNode(node));

  const mapName = maps.find((map) => map.id === params.id)?.name || "";

  return (
    <ReactFlowProvider>
      <Map
        nodesProp={reactFlowNodes}
        edgesProp={edges}
        mapId={params.id}
        mapName={mapName}
      />
    </ReactFlowProvider>
  );
}
