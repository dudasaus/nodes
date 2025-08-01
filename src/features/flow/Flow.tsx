import "@xyflow/react/dist/style.css";
import "./Flow.css";
import { type DragEventHandler, useCallback, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  type DefaultEdgeOptions,
  type Edge,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { dragAndDropService } from "../../services/draganddrop/DragAndDropService";
import { GenericNode } from "../../components/nodes/generic/GenericNode";
import {
  numberHandleType,
  stringHandleType,
} from "../../components/nodes/generic/GenericNodeTypes";

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

export function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const flow = useReactFlow();

  const nodeTypes: NodeTypes = {
    genericNode: GenericNode,
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onDragOver: DragEventHandler = (ev) => {
    // Allow drop.
    if (dragAndDropService.getData()) {
      ev.preventDefault();
    }
  };

  const onDrop: DragEventHandler = (ev) => {
    const position = flow.screenToFlowPosition({
      x: ev.clientX,
      y: ev.clientY,
    });
    flow.addNodes({
      type: "genericNode",
      id: crypto.randomUUID(),
      data: dragAndDropService.getData(),
      position,
    });
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      defaultEdgeOptions={defaultEdgeOptions}
      colorMode="light"
      className="flow"
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
