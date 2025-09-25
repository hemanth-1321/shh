import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import AuthRoutes from "./routes/authRoutes";
import MessageRoute from "./routes/messages";

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Map<string, WebSocket>();

const PORT = 8080;

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (data) => {
    console.log("data", JSON.parse(data.toString()));
    try {
      const parsed = JSON.parse(data.toString());

      if (parsed.type === "register" && parsed.userId) {
        console.log("parsed", parsed.userId);
        clients.set(parsed.userId, ws);
        console.log(`Registered client for userId: ${parsed.userId}`);
      }
    } catch (err) {
      console.log("Invalid WebSocket message format");
    }
  });

  ws.on("close", () => {
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        console.log("what so ever");
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send(", hello duniya!");
});

app.use("/auth", AuthRoutes);
app.use("/message", MessageRoute);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server runnig on  ${PORT}`);
});
