"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const messages_1 = __importDefault(require("./routes/messages"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use("/auth", authRoutes_1.default);
app.use("/message", messages_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
