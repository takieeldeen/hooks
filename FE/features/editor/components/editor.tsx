"use client";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "next/navigation";
import { ParamsOf } from "@/.next/dev/types/routes";
import { useGetWorkflowDetails } from "@/api/workflows";
import { nodeComponents } from "@/config/node-components";
import EditorAddNodeButton from "./editor-add-node-button";
import { useEditor } from "./editor-provider";

export default function Editor() {
  const { workflowId } = useParams<ParamsOf<"/workflows/[workflowId]">>();
  const { data: workflow } = useGetWorkflowDetails(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow?.content.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(workflow?.content.edges ?? []);
  const { setEditorInstance } = useEditor();
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeComponents}
        onInit={setEditorInstance}
        snapGrid={[30, 30]}
        snapToGrid
        panOnScroll
        // panOnDrag={false}
        // selectionOnDrag

        // proOptions={{
        //   hideAttribution: true,
        // }}
      >
        <Panel position="top-right">
          <EditorAddNodeButton />
        </Panel>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
