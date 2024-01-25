// import Dagre from "@dagrejs/dagre";
// import { useCallback, useEffect } from "react";
// import {
//   Edge,
//   Node,
//   useEdgesState,
//   useNodesState,
//   useReactFlow,
// } from "reactflow";

// const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

// const getLayoutedElements = (
//   nodes: Node[],
//   edges: Edge[],
//   options: { direction: "TB" | "LR" },
// ) => {
//   g.setGraph({ rankdir: options.direction });

//   edges.forEach((edge) => g.setEdge(edge.source, edge.target));
//   nodes.forEach((node) => g.setNode(node.id, node as any));

//   Dagre.layout(g);

//   return {
//     nodes: nodes.map((node) => {
//       const { x, y } = g.node(node.id);

//       return { ...node, position: { x, y } };
//     }),
//     edges,
//   };
// };

// const LayoutFlow = () => {
//   const { fitView } = useReactFlow();
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onLayout = useCallback(
//     (direction: "TB" | "LR") => {
//       const layouted = getLayoutedElements(nodes, edges, { direction: "LR" });

//       setNodes([...layouted.nodes]);
//       setEdges([...layouted.edges]);
//     },
//     [nodes, edges, setEdges, setNodes],
//   );

//   // Use useEffect to trigger fitView
//   useEffect(() => {
//     window.requestAnimationFrame(() => {
//       fitView();
//     });
//   }, [fitView]);

//   // Rest of your component code...
// };

// export default LayoutFlow;
