"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import NodeEdge from "@/components/Flow/CardComponents/NodeEdge";
import NodeWithState from "@/components/Flow/CardComponents/NodewithState";
import { DialogTwoInputs } from "@/components/Flow/CustomComponents/DialogTwoInputs";
import FlowFooter from "@/components/Flow/CustomComponents/flowFooter";
import { FlowHeader } from "@/components/Flow/Header/FlowHeader";
import { Button } from "@/components/ui/button";
import useGetMapByUserId from "@/lib/services/maps/useGetMapsByUserId";
import { NodeData } from "@/lib/services/node/node.types";
import useNodeCreate from "@/lib/services/node/useCreateNode";
import useNodeDelete from "@/lib/services/node/useDeleteNode";
import useGetNodesByMapId from "@/lib/services/node/useGetNodesByMapId";
import useNodeUpdate from "@/lib/services/node/useUpdateNode";
import {
  databaseNodeToStoreNode,
  storeNodeToDatabaseNode,
} from "@/lib/services/node/utils";
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
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(nodesProp);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesProp);
  const [isOpen, setIsOpen] = useState(false);
  const [parentNodeId, setParentNodeId] = useState<string | null>(null);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreateNode, setCreateNode] = useState(false);
  const [xPosition, setXPosition] = useState(500);
  const [yPosition, setYPosition] = useState(500);
  const [nodeIdToEdit, setNodeIdToEdit] = useState<string | null>(null);
  const [placeholderTopInput, setPlaceholderTopInput] = useState("");
  const [placeholderBottomInput, setPlaceholderBottomInput] = useState("");

  const { screenToFlowPosition } = useReactFlow();
  const reactflowStore = useStoreApi();

  const createNode = useNodeCreate();
  const updateNode = useNodeUpdate();
  const deleteNode = useNodeDelete();

  useEffect(() => {
    if (nodesProp.length === 0) {
      setDialogOpen(true);
      setCreateNode(true);
    } else {
      if (!nodeIdToEdit) {
        setDialogOpen(false);
        setCreateNode(false);
      }
    }
    setNodes(nodesProp);
    setEdges(edgesProp);
  }, [nodesProp, setNodes, setEdges, edgesProp, nodeIdToEdit]);

  const onDragEnd: NodeDragHandler = async (_event, node, _nodes) => {
    const dbUpdatedNode = storeNodeToDatabaseNode(node);
    await updateNode(dbUpdatedNode);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCreateNode(false);
    setNodeIdToEdit(null);
  };

  const getChildNodePosition = useCallback(
    (event: MouseEvent, parentNode?: Node) => {
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
    },
    [reactflowStore, screenToFlowPosition],
  );

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
          setPlaceholderTopInput("");
          setPlaceholderBottomInput("");
        }
      }
    },
    [getChildNodePosition, reactflowStore, connectingNodeId],
  );

  const openDialogEditNode = (nodeId: string) => {
    setDialogOpen(true);
    setCreateNode(false);
    setNodeIdToEdit(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setPlaceholderTopInput(node.data.frontside);
      setPlaceholderBottomInput(node.data.backside);
    } else {
      setPlaceholderTopInput("");
      setPlaceholderBottomInput("");
    }
  };

  const openDialogAddNode = () => {
    const topLevelNode = nodes.find((n) => n.data.parentNodeId === null);
    setDialogOpen(true);
    setCreateNode(true);
    setXPosition(topLevelNode ? topLevelNode.position.x + 350 : 500);
    setYPosition(topLevelNode?.position.y || 500);
    setParentNodeId(null);
    setPlaceholderTopInput("");
    setPlaceholderBottomInput("");
  };

  const handleDialogSubmit = async (front: string, back: string) => {
    if (isCreateNode) {
      await createNode({
        mapId: mapId,
        frontside: front,
        backside: back,
        xPosition,
        yPosition,
        nodeType: "flashcard",
        parentNodeId: parentNodeId ? parentNodeId : undefined,
      });
      const parentNode = nodes.find((n) => n.id === parentNodeId);
      if (parentNode) {
        parentNode.data.nodeType = "stack";

        const dbParentNode = storeNodeToDatabaseNode(parentNode);
        await updateNode(dbParentNode);
      }
    } else {
      const node = nodes.find((n) => n.id === nodeIdToEdit);

      if (node) {
        node.data.frontside = front;
        node.data.backside = back;

        const dbNode = storeNodeToDatabaseNode(node);
        await updateNode(dbNode);
      }
    }
    setParentNodeId(null);
  };

  //console.log("id", mapId, "name", mapName, "nodes", nodes, "edges", edges);

  const nodesWithHandlers = nodes.map((node) => {
    node.data.editNode = openDialogEditNode;
    node.data.deleteNode = deleteNode;
    return node;
  });

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

      {dialogOpen && (
        <DialogTwoInputs
          topInput={placeholderTopInput}
          bottomInput={placeholderBottomInput}
          placeholderTopInput={"Frontside"}
          placeholderBottomInput={"Backside"}
          isDialogOpen={dialogOpen}
          onSubmit={handleDialogSubmit}
          closeDialog={closeDialog}
          classNameInputFields={""}
        />
      )}

      <ReactFlow
        nodes={nodesWithHandlers}
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
            onClick={openDialogAddNode}
          >
            Add flashcard
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
