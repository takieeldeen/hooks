import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { cn } from "@/lib/utils";
import { useSocket } from "@/providers/SocketProvider";
import { NodeExecution } from "@/types/workflows";
import { CircleCheck, CircleDashed, CircleX, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

interface NodeExecutionItemProps {
  nodeEx: NodeExecution;
  setSelectedNodeId: (id: string) => void;
  activeNodeId: string | null;
}

function NodeExecutionItem({
  nodeEx,
  setSelectedNodeId,
  activeNodeId,
}: NodeExecutionItemProps) {
  const [status, setStatus] = useState<NodeStatus>(
    mapBackendStatusToNodeStatus(nodeEx.status),
  );
  const socket = useSocket();
  useEffect(() => {
    const handleNodeUpdate = (payload: any) => {
      console.log("NEW NOTIFICATION");
      if (payload.nodeId === nodeEx.node?.id) {
        setStatus(mapBackendStatusToNodeStatus(payload.status));
        console.log(nodeEx?.node?.name, "status will be", payload.status);
      }
    };

    socket.on("NODE-UPDATE", handleNodeUpdate);
    return () => {
      socket.off("NODE-UPDATE", handleNodeUpdate);
    };
  }, [nodeEx.id, nodeEx.node?.id, nodeEx.node?.name, socket]);

  return (
    <div key={nodeEx.id} className="relative">
      <button
        onClick={() => setSelectedNodeId(nodeEx.id)}
        className={cn(
          "w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-accent focus:outline-none",
          activeNodeId === nodeEx.id && "bg-accent",
        )}
      >
        <div className="mt-0.5 shrink-0">
          <NodeStatusIcon status={status} />
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
    </div>
  );
}

export default NodeExecutionItem;

function mapBackendStatusToNodeStatus(status: string): NodeStatus {
  switch (status) {
    case "RUNNING":
      return "loading";
    case "SUCCESS":
      return "success";
    case "FAILED":
      return "error";
    default:
      return "initial";
  }
}

function getDuration(nodeEx: NodeExecution) {
  if (!nodeEx.startedAt) return "-";
  if (!nodeEx.completedAt) return "Running...";
  const ms =
    new Date(nodeEx.completedAt).getTime() -
    new Date(nodeEx.startedAt).getTime();
  return `${(ms / 1000).toFixed(2)}s`;
}

function NodeStatusIcon({ status }: { status: NodeStatus }) {
  switch (status) {
    case "success":
      return <CircleCheck className="size-4 text-emerald-500" />;
    case "error":
      return <CircleX className="size-4 text-red-500" />;
    case "loading":
      return <CircleDashed className="size-4 text-blue-500 animate-spin" />;
    case "initial":
    default:
      return <CircleDashed className="size-4 text-gray-400" />;
  }
}
