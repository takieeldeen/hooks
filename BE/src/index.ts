import express from "express";
import { createServer } from "http";
import {schedule,} from 'node-cron';
import { Server } from "socket.io";
import { testFn } from "./controllers/test";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';

const app = express();
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
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// cron.schedule("* * * * *",task)
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/api", testFn);





httpServer.listen(port, () => {
  console.log(`HTTP Server Started Listening on ${new Date().toISOString()} on PORT: ${port}`);
});