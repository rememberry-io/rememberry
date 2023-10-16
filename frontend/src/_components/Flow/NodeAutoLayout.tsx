// Linus' File fürs Auto-Layout

// import dagre, { GraphLabel } from "dagre";
// import { Edge, Node, Position } from "reactflow";
// ​
// import { EXPLORER_GRID_SIZE } from "../../../config/explorer.config";
// ​
// // In order to keep this example simple the node width and height are hardcoded.
// // In a real world app you would use the correct width and height values of
// // const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height
// const NODE_WIDTH = 493 * 2;
// const NODE_HEIGHT = 184 * 2;
// ​
// const roundToNearestFactor = (num: number, factor: number): number => {
//   if (num > 0) return Math.ceil(num / factor) * factor;
// ​
//   if (num < 0) return Math.floor(num / factor) * factor;
// ​
//   return factor;
// };
// ​
// export const getLayoutedNodes = (
//   nodes: Node[],
//   edges: Edge[],
//   direction: GraphLabel["rankdir"] = "LR",
//   autoPositionHandlesBasedOnDirection = false,
// ) => {
//   const isHorizontal = direction === "LR";
// ​
//   const dagreGraph = new dagre.graphlib.Graph();
// ​
//   dagreGraph.setDefaultEdgeLabel(() => ({}));
//   dagreGraph.setGraph({ rankdir: direction });
// ​
//   for (const node of nodes) {
//     dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
//   }
//   for (const edge of edges) {
//     dagreGraph.setEdge(edge.source, edge.target);
//   }
//   dagre.layout(dagreGraph);
// ​
//   const layoutedNodes = nodes.map((node) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
// ​
//     if (autoPositionHandlesBasedOnDirection) {
//       node.targetPosition = isHorizontal ? Position["Left"] : Position["Top"];
// ​
//       node.sourcePosition = isHorizontal
//         ? Position["Right"]
//         : Position["Bottom"];
//     }
//     node.position = {
//       x:
//         roundToNearestFactor(
//           nodeWithPosition.x - NODE_WIDTH / 2,
//           EXPLORER_GRID_SIZE
//         ) +
//         Math.random() / 1000,
//       y: roundToNearestFactor(
//         nodeWithPosition.y - NODE_HEIGHT / 2,
//         EXPLORER_GRID_SIZE
//       ),
//     };
//     return node;
//   });
//   return layoutedNodes;
// };
