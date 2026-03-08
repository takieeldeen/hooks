"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DotPattern } from "../ui/dot-pattern";
import { useEffect, useState } from "react";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "../react-flow/node-status-indicator";
import { BaseNode, BaseNodeContent } from "../react-flow/base-node";
import { Icon } from "@iconify/react";
import { CheckCircleIcon, Loader2Icon, XCircleIcon } from "lucide-react";

export default function RealtimeBentoCard() {
  return (
    <Card className="w-full relative">
      <CardHeader className="text-left">
        <CardTitle>Realtime</CardTitle>
        <CardDescription>
          Hooks Reflects realtime status for all nodes and workflows.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-96">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,rgba(255,255,255,0.6),transparent)]",
          )}
        />
        <RealtimeDiscordCard />
      </CardContent>
    </Card>
  );
}
function RealtimeDiscordCard() {
  const [status, setStatus] = useState<NodeStatus>("initial");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      // Reset to initial when not hovered
      const timer = setTimeout(() => {
        setStatus("initial");
      }, 300);
      return () => clearTimeout(timer);
    }

    // State machine: initial -> loading -> success/error
    const progressTimer = setTimeout(() => {
      setStatus("loading");
    }, 500);

    const completionTimer = setTimeout(() => {
      // Randomly choose success or error (70% success rate)
      const randomSuccess = Math.random() > 0.3;
      setStatus(randomSuccess ? "success" : "error");
    }, 2500);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(completionTimer);
    };
  }, [isHovered]);

  const getStatusLabel = () => {
    switch (status) {
      case "loading":
        return "Processing...";
      case "success":
        return "Connected";
      case "error":
        return "Failed";
      default:
        return "Ready";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeStatusIndicator status={status} variant="border">
        <BaseNode className="w-64 cursor-pointer transition-transform hover:scale-105">
          <BaseNodeContent className="flex flex-row items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#5865F2]/10">
              <Icon icon="logos:discord-icon" className="size-8" />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-semibold text-foreground">Discord</span>
              <div className="flex items-center gap-1.5">
                {status === "loading" && (
                  <Loader2Icon className="size-3.5 animate-spin text-blue-600" />
                )}
                {status === "success" && (
                  <CheckCircleIcon className="size-3.5 text-green-600" />
                )}
                {status === "error" && (
                  <XCircleIcon className="size-3.5 text-red-600" />
                )}
                <span className={cn("text-xs", getStatusColor())}>
                  {getStatusLabel()}
                </span>
              </div>
            </div>
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </div>
  );
}
