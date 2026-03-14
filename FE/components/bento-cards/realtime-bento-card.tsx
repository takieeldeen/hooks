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

export default function RealtimeBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl h-96">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="text-left relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon icon="lucide:zap" className="text-indigo-400" />
          Realtime
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Reflects live status for all nodes and active workflows.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-48 flex items-center justify-center">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(150px_circle_at_center,white,transparent)] opacity-20",
          )}
        />
        <RealtimeDiscordCard />
      </CardContent>
    </Card>
  );
}
function RealtimeDiscordCard() {
  const [status, setStatus] = useState<NodeStatus>("success");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      setStatus((prev) => {
        if (prev === "loading") return "success";
        if (prev === "success") return "error";
        return "loading";
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="relative z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setStatus("success");
      }}
    >
      <div className="relative h-24 w-24 overflow-hidden flex items-center justify-center rounded-xl rounded-r-[40px]">
        <div className="relative z-20 h-23 w-23 rounded-xl bg-neutral-800 rounded-r-[40px] flex items-center justify-center">
          <Icon icon="logos:discord-icon" className="size-10" />
          <Icon
            icon={
              status === "loading"
                ? "fluent:spinner-ios-16-filled"
                : status === "success"
                  ? "icon-park-outline:check-one"
                  : "mdi:cross-circle-outline"
            }
            className={cn(
              "absolute bottom-2 left-2 size-4",
              status === "loading" && "animate-spin text-indigo-400",
              status === "success" && "text-teal-500",
              status === "error" && "text-rose-500",
            )}
          />
        </div>
        <div
          className={cn(
            "absolute inset-0",
            status === "loading" &&
              "origin-top top-[10%] left-[10%]  h-[150%] w-[20%] animate-spin bg-linear-to-l from-indigo-500 to-indigo-700",
            status === "success" && "bg-teal-500",
            status === "error" && "bg-rose-500",
          )}
        ></div>
      </div>
    </div>
  );
}
