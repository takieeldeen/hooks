"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Icon } from "@iconify/react";

const logs = [
  {
    id: 1,
    event: "Order Received",
    status: "success",
    time: "2m ago",
    app: "simple-icons:shopify",
  },
  {
    id: 2,
    event: "Customer Notified",
    status: "success",
    time: "5m ago",
    app: "mdi:slack",
  },
  {
    id: 3,
    event: "Data Synced",
    status: "loading",
    time: "Just now",
    app: "simple-icons:airtable",
  },
  {
    id: 4,
    event: "Webhook Triggered",
    status: "error",
    time: "15m ago",
    app: "logos:webhooks",
  },
];

export default function LogsBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl h-96">
      <div className="absolute inset-0 bg-linear-to-bl from-rose-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="text-left relative z-10 pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Icon icon="lucide:activity" className="text-rose-400" />
          Event Logs
        </CardTitle>
        <CardDescription className="text-neutral-400 text-xs">
          Track executions with live observability.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 pt-2">
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-neutral-800">
                  <Icon icon={log.app} className="size-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-white">
                    {log.event}
                  </span>
                  <span className="text-[9px] text-neutral-500">
                    {log.time}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-[9px] uppercase tracking-tighter font-bold",
                    log.status === "success" && "text-emerald-500",
                    log.status === "loading" && "text-blue-500",
                    log.status === "error" && "text-rose-500",
                  )}
                >
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
