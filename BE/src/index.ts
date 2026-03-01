import express from "express";
import { createServer } from "http";
import { schedule } from "node-cron";
import { Server } from "socket.io";
import { parse } from "cookie";
import app from "./app";
import { auth } from "./lib/auth";

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  const session = await auth.api.getSession({
    headers: socket.request.headers,
  });
  const userId = session?.user.id;
  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`user:${userId} Joined his realtime room`);
  }
  console.log(`Connection Established with ID : ${socket.id}`);
  socket.on("schedule", (data) => {
    const uniquer = schedule(data.expression, () => console.log(data.data));
    console.log(uniquer);
  });
});

const port = process.env.PORT ?? "9001";

httpServer.listen(port, () => {
  console.log(
    `HTTP Server Started Listening on ${new Date().toISOString()} on PORT: ${port}`,
  );
});
