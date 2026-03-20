"use client";

import {
  useGetWorkflowExecution,
} from "@/api/workflows";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/SocketProvider";
import {
  LogUpdateWebSocketPayload,
  NodeExecutionWebSocketPayload,
  WorkflowExecution,
} from "@/types/workflows";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleX,
  LayoutTemplate,
  Terminal,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NodeExecutionItem from "./node-execution-item";
import { APIDetailsResponse } from "@/types/common";

interface ExecutionViewerProps {
  workflowId: string;
  executionId: string;
}

export function ExecutionViewer({
  workflowId,
  executionId,
}: ExecutionViewerProps) {
  // const [updates, setUpdates] = useState<Record<string, NodeExecution>>({});
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { data, isLoading, isError, queryKey } = useGetWorkflowExecution(
    workflowId,
    executionId,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !queryKey) return;

    const handleNodeUpdate = (payload: NodeExecutionWebSocketPayload) => {
      if (!payload) return;
      if (payload.executionData.workflowExecutionId !== executionId) return;
      queryClient.setQueryData(
        queryKey,
        (prev: APIDetailsResponse<WorkflowExecution>) => {
          const updatedResponse: APIDetailsResponse<WorkflowExecution> =
            JSON.parse(JSON.stringify(prev));
          const executionIndex =
            updatedResponse?.content?.nodeExecutions?.findIndex(
              (execution) => execution.id === payload.executionData.id,
            );
          if (
            updatedResponse?.content?.nodeExecutions &&
            typeof executionIndex === "number"
          ) {
            console.log(
              updatedResponse.content.nodeExecutions[executionIndex],
              payload.executionData,
            );
            updatedResponse.content.nodeExecutions[executionIndex] =
              payload.executionData;
          }
          return updatedResponse;
        },
      );
    };

    socket.on("NODE-UPDATE", handleNodeUpdate);
    return () => {
      socket.off("NODE-UPDATE", handleNodeUpdate);
    };
  }, [executionId, queryClient, queryKey, socket]);

  // ── Real-time log streaming ────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !queryKey) return;

    const handleLogUpdate = (payload: LogUpdateWebSocketPayload) => {
      if (!payload) return;
      queryClient.setQueryData(
        queryKey,
        (prev: APIDetailsResponse<WorkflowExecution>) => {
          if (!prev?.content?.nodeExecutions) return prev;
          // Deep-clone to avoid mutating cached state
          const updated: APIDetailsResponse<WorkflowExecution> = JSON.parse(
            JSON.stringify(prev),
          );
          const nodeEx = updated.content!.nodeExecutions!.find(
            (n) => n.id === payload.nodeExecutionId,
          );
          if (nodeEx) {
            nodeEx.logs = [...(nodeEx.logs ?? []), payload.log];
          }
          return updated;
        },
      );
    };

    socket.on("LOG-UPDATE", handleLogUpdate);
    return () => {
      socket.off("LOG-UPDATE", handleLogUpdate);
    };
  }, [queryClient, queryKey, socket]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <CircleDashed className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isError || !data?.content) {
    return (
      <div className="flex w-full items-center justify-center p-8 text-destructive">
        <CircleAlert className="mr-2 size-5" />
        <p>Failed to load execution details.</p>
      </div>
    );
  }

  const execution = data.content;
  const nodeExecutions = execution.nodeExecutions || [];

  // Auto-select the first node if none is selected
  const activeNodeId = selectedNodeId || (nodeExecutions[0]?.id ?? null);
  const activeNode = nodeExecutions.find((n) => n.id === activeNodeId);
  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 p-4 md:p-8">
      {/* Sidebar: List of executed nodes */}
      <Card className="w-full md:w-80 h-[400px] md:h-full flex flex-col overflow-hidden shrink-0">
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            Execution Steps
            <Badge variant="secondary" className="ml-auto">
              {nodeExecutions.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col">
              {nodeExecutions.map((nodeEx, index) => (
                <Fragment key={nodeEx.id}>
                  <NodeExecutionItem
                    nodeEx={nodeEx}
                    activeNodeId={activeNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                  />
                  {index < nodeExecutions.length - 1 && (
                    <Separator className="mx-4 w-auto" />
                  )}
                </Fragment>
              ))}
              {nodeExecutions.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No steps executed yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Area: Node Details */}
      <Card className="flex-1 h-[600px] md:h-full flex flex-col overflow-hidden min-w-0">
        {activeNode ? (
          <>
            <CardHeader className="py-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {activeNode.node?.name || "Node Details"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeNode.node?.type}
                  </p>
                </div>
                <NodeStatusBadge status={activeNode.status} />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 flex-1 overflow-auto flex flex-col min-h-0">
              <Tabs defaultValue="outputs" className="flex-1 flex flex-col">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="inputs">Inputs</TabsTrigger>
                  <TabsTrigger value="outputs">Outputs</TabsTrigger>
                  <TabsTrigger value="logs">
                    Logs ({activeNode.logs?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="inputs"
                  className="flex-1 mt-4 overflow-auto rounded-md border bg-muted/50 transition-all"
                >
                  <div className="p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap wrap-break-word">
                      {JSON.stringify(activeNode.inputs || {}, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent
                  value="outputs"
                  className="flex-1 mt-4 overflow-auto rounded-md border bg-muted/50 transition-all"
                >
                  <div className="p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap wrap-break-word">
                      {JSON.stringify(activeNode.outputs || {}, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent
                  value="logs"
                  className="flex-1 mt-4 overflow-auto rounded-md border bg-muted/50 transition-all"
                >
                  <div className="p-0">
                    {activeNode.logs && activeNode.logs.length > 0 ? (
                      <div className="flex flex-col divide-y">
                        {activeNode.logs.map((log) => (
                          <div
                            key={log.id}
                            className="flex items-start gap-3 p-4 text-sm font-mono"
                          >
                            <span className="text-muted-foreground whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <LogLevelBadge level={log.level} />
                            <span className="wrap-break-word flex-1 leading-relaxed">
                              {log.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-8 text-muted-foreground text-sm flex-col gap-2">
                        <Terminal className="size-8 opacity-50" />
                        <p>No logs available for this step.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <LayoutTemplate className="size-12 opacity-20 mb-4" />
            <p>Select a step from the sidebar to view details.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function NodeStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "SUCCESS":
      return (
        <Badge
          variant="outline"
          className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        >
          <CircleCheck className="mr-1.5 size-3.5" />
          Success
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="outline"
          className="text-red-500 bg-red-500/10 border-red-500/20"
        >
          <CircleX className="mr-1.5 size-3.5" />
          Failed
        </Badge>
      );
    case "RUNNING":
      return (
        <Badge
          variant="outline"
          className="text-blue-500 bg-blue-500/10 border-blue-500/20"
        >
          <CircleDashed className="mr-1.5 size-3.5 animate-spin" />
          Running
        </Badge>
      );
    case "IDLE":
    default:
      return (
        <Badge
          variant="outline"
          className="text-gray-500 bg-gray-500/10 border-gray-500/20"
        >
          <CircleDashed className="mr-1.5 size-3.5" />
          Idle
        </Badge>
      );
  }
}

function LogLevelBadge({ level }: { level: string }) {
  switch (level) {
    case "ERROR":
      return <span className="text-red-500 font-semibold">[ERROR]</span>;
    case "WARNING":
      return <span className="text-yellow-500 font-semibold">[WARN]</span>;
    case "INFO":
    default:
      return <span className="text-blue-500 font-semibold">[INFO]</span>;
  }
}
