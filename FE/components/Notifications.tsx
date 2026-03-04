"use client";

import React from "react";
import { Bell, Check, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const dummyNotifications = [
  {
    id: 1,
    title: "Workflow Complete",
    description: "Your 'Image Processor' workflow finished successfully.",
    time: "2 mins ago",
    type: "success",
    unread: true,
  },
  {
    id: 2,
    title: "New Connection",
    description: "OpenAI API key was successfully connected.",
    time: "1 hour ago",
    type: "info",
    unread: true,
  },
  {
    id: 3,
    title: "Execution Error",
    description: "Failed to send webhook in 'Daily Report'.",
    time: "5 hours ago",
    type: "error",
    unread: false,
  },
];

function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <PopoverHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <PopoverTitle className="text-base">Notifications</PopoverTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:bg-transparent"
            >
              Mark all as read
            </Button>
          </div>
        </PopoverHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {dummyNotifications.length > 0 ? (
            <div className="divide-y">
              {dummyNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-4 transition-colors hover:bg-muted/50 cursor-pointer",
                    notification.unread && "bg-primary/5",
                  )}
                >
                  <div className="mt-0.5">
                    {notification.type === "success" && (
                      <div className="rounded-full p-1 bg-green-500/10 text-green-600">
                        <Check className="size-3.5" />
                      </div>
                    )}
                    {notification.type === "info" && (
                      <div className="rounded-full p-1 bg-blue-500/10 text-blue-600">
                        <Info className="size-3.5" />
                      </div>
                    )}
                    {notification.type === "error" && (
                      <div className="rounded-full p-1 bg-red-500/10 text-red-600">
                        <AlertCircle className="size-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold truncate">
                        {notification.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Bell className="size-10 mb-2 opacity-20" />
              <p className="text-sm">No new notifications</p>
            </div>
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs hover:bg-muted font-medium"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Notifications;
