import express from "express";
import { createServer } from "http";
import {schedule,} from 'node-cron';
import { Server } from "socket.io";

import app from "./app";

const httpServer = createServer(app);
const io = new Server(httpServer,{
  cors: {
    origin: ["http://localhost:3000"]
  }
});

io.on('connection',(socket)=>{
  console.log(`Connection Established with ID : ${socket.id}`)
  socket.on('schedule',(data)=>{
    const uniquer = schedule(data.expression  ,()=>console.log(data.data))
    console.log(uniquer)
  })
})





const port = process.env.PORT ?? "9001";

const task = ()=>{
  console.log('Running a Scheduled task at : ',new Date())
}




httpServer.listen(port, () => {
  console.log(`HTTP Server Started Listening on ${new Date().toISOString()} on PORT: ${port}`);
});