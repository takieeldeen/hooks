import React from "react";
import { io } from "socket.io-client";

function useSocket() {
  const socket = io("http://localhost:8080");
  socket.on("connect", () => {
    console.log(`SOCKET Connected successfully`);
  });
  socket.on("disconnect", () => {
    console.log(`SOCKET disconnected successfully`);
  });
  return socket;
}

export default useSocket;
