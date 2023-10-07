"use client"
import React, { useState, useCallback } from 'react';
import ReactFlow, { Controls, Background, Node, Edge, applyEdgeChanges, applyNodeChanges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

// as reactflow is written in TS -> types don't have to be included separately
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 100, y: 100 },
	data: { label: 'Leolo'}
  },
  {
    id: '2',
    type: 'default',
    position: { x: 200, y: 200 },
	data: { label: 'Knecht'}
  },
];

const initialEdges: Edge[] = [
	{
		id: '1-2',
		source: '1',
		target: '2',
		label: 'ist ein',
		type: 'step'
	}
  ];


  
  
  
  
  export default function Map() {
	  const [nodes, setNodes] = useState(initialNodes);
	  const [edges, setEdges] = useState(initialEdges);

	  // applyChanges functions apply changes to current state of the element (either edge or node)
	  const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), []);


	  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);


	  const onConnectHandler = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);


	  return (
			<div style={{height: 1000}}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
	);
}
