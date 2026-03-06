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
import { nodeComponents, NodeType } from "@/config/node-components";
import EditorAddNodeButton from "./editor-add-node-button";
import { useEditor } from "./editor-provider";
import EditorExecuteButton from "./editor-execute-button";
import { useTheme } from "next-themes";
import DeletableEdge from "./editor-edge";

const edgeTypes = {
  default: DeletableEdge,
};
export default function Editor() {
  const { workflowId } = useParams<ParamsOf<"/workflows/[workflowId]">>();
  const { data: workflow } = useGetWorkflowDetails(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow?.content.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(workflow?.content.edges ?? []);
  const { setEditorInstance } = useEditor();
  const theme = useTheme();
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
      setEdges((edgesSnapshot) =>
        addEdge({ ...params, animated: true }, edgesSnapshot),
      ),
    [],
  );
  const hasManualTrigger = nodes.some(
    (node) => (node.type as NodeType) === "MANUAL_TRIGGER",
  );
  console.log(nodes);
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
        edgeTypes={edgeTypes}
        onInit={setEditorInstance}
        snapGrid={[30, 30]}
        snapToGrid
        panOnScroll
      >
        <Panel position="top-right">
          <EditorAddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <EditorExecuteButton />
          </Panel>
        )}
        <Background
          style={{
            backgroundColor:
              theme.resolvedTheme === "dark" ? "#171717" : "white",
          }}
          color={theme.resolvedTheme === "dark" ? "#525252" : "#d4d4d4"}
        />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
