import { useSocket } from "@/providers/SocketProvider";
import { useEffect, useState } from "react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

export function useNodeStatus(nodeId: string) {
  const [status, setStatus] = useState<NodeStatus>("initial");
  const socket = useSocket();
  useEffect(() => {
    socket.on("NODE-UPDATE", (payload) => {
      if (payload.nodeId === nodeId) {
        switch (payload.status) {
          case "RUNNING":
            setStatus("loading");
            break;
          case "SUCCESS":
            setStatus("success");
            break;
          case "FAILED":
            setStatus("error");
            break;
          default:
            setStatus("initial");
        }
      }
    });
  }, [nodeId, socket]);
  return { status };
}
