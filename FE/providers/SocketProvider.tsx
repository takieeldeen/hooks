"use client";
import useSocket from "@/hooks/use-socket";
import { ReactNode } from "react";

function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const handleClick = () => {
    socket.emit("schedule", {
      data: "Hello World",
      expression: "*/5 * * * * *",
    });
  };
  return children;
}

export default SocketProvider;
