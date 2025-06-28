"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const messages_1 = __importDefault(require("./routes/messages"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const clients = new Map(); // userId -> ws
const PORT = 8080;
// WebSocket connection
wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    ws.on("message", (data) => {
        console.log("data", JSON.parse(data.toString()));
        try {
            const parsed = JSON.parse(data.toString());
            if (parsed.type === "register" && parsed.userId) {
                clients.set(parsed.userId, ws);
                console.log(`Registered client for userId: ${parsed.userId}`);
            }
        }
        catch (err) {
            console.log("Invalid WebSocket message format");
        }
    });
    ws.on("close", () => {
        for (const [userId, client] of clients.entries()) {
            if (client === ws) {
                clients.delete(userId);
                console.log(`Disconnected WebSocket for userId: ${userId}`);
                break;
            }
        }
    });
});
// Share clients map across app
app.set("clients", clients);
// Basic routes
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use("/auth", authRoutes_1.default);
app.use("/message", messages_1.default);
// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
