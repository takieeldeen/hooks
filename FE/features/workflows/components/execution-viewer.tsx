"use client";

import { useGetWorkflowExecution } from "@/api/workflows";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NodeExecution } from "@/types/workflows";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  LayoutTemplate,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ExecutionViewerProps {
  workflowId: string;
  executionId: string;
}

export function ExecutionViewer({
  workflowId,
  executionId,
}: ExecutionViewerProps) {
  const { data, isLoading, isError } = useGetWorkflowExecution(
    workflowId,
    executionId
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
                <div key={nodeEx.id} className="relative">
                  <button
                    onClick={() => setSelectedNodeId(nodeEx.id)}
                    className={cn(
                      "w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-accent focus:outline-none",
                      activeNodeId === nodeEx.id && "bg-accent"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      <NodeStatusIcon status={nodeEx.status} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {nodeEx.node?.name || nodeEx.node?.type || "Unknown Node"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="truncate">{nodeEx.node?.type}</span>
                        {nodeEx.startedAt && (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 shrink-0">
                              <Clock className="size-3" />
                              {getDuration(nodeEx)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                  {index < nodeExecutions.length - 1 && (
                    <Separator className="mx-4 w-auto" />
                  )}
                </div>
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
                  <TabsTrigger value="logs">Logs ({activeNode.logs?.length || 0})</TabsTrigger>
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

function getDuration(nodeEx: NodeExecution) {
  if (!nodeEx.startedAt) return "-";
  if (!nodeEx.completedAt) return "Running...";
  const ms =
    new Date(nodeEx.completedAt).getTime() -
    new Date(nodeEx.startedAt).getTime();
  return `${(ms / 1000).toFixed(2)}s`;
}

function NodeStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "SUCCESS":
      return <CircleCheck className="size-4 text-emerald-500" />;
    case "FAILED":
      return <CircleX className="size-4 text-red-500" />;
    case "RUNNING":
      return <CircleDashed className="size-4 text-blue-500 animate-spin" />;
    case "IDLE":
    default:
      return <CircleDashed className="size-4 text-gray-400" />;
  }
}

function NodeStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "SUCCESS":
      return (
        <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
          <CircleCheck className="mr-1.5 size-3.5" />
          Success
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="outline" className="text-red-500 bg-red-500/10 border-red-500/20">
          <CircleX className="mr-1.5 size-3.5" />
          Failed
        </Badge>
      );
    case "RUNNING":
      return (
        <Badge variant="outline" className="text-blue-500 bg-blue-500/10 border-blue-500/20">
          <CircleDashed className="mr-1.5 size-3.5 animate-spin" />
          Running
        </Badge>
      );
    case "IDLE":
    default:
      return (
        <Badge variant="outline" className="text-gray-500 bg-gray-500/10 border-gray-500/20">
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
