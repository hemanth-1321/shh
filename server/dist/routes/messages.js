"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const senderMiddleware_1 = require("../middlewares/senderMiddleware");
const middleware_1 = require("../middlewares/middleware");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/:username", senderMiddleware_1.senderMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { question, content } = req.body;
    const { username } = req.params;
    const recipient = yield prisma.user.findUnique({
        where: { username },
    });
    if (!recipient) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    let senderId = null;
    let isAnonymous = true;
    try {
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) {
            const user = yield prisma.user.findUnique({
                where: { id: req.user.id },
            });
            if (user) {
                senderId = user.id;
                isAnonymous = false;
            }
        }
    }
    catch (error) {
        console.log("Token/user lookup failed. Proceeding anonymously.");
        // Proceeding anonymously, so no error response here
    }
    try {
        const message = yield prisma.message.create({
            data: {
                content,
                senderId,
                recipientId: recipient.id,
                isAnonymous,
                question,
            },
        });
        res.status(201).json({ message: "Message sent", data: message });
        return;
    }
    catch (err) {
        console.error("Error creating message:", err);
        res.status(500).json({ message: "Failed to send message" });
        return;
    }
}));
router.get("/bulk", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log("user", userId);
    try {
        const messages = yield prisma.message.findMany({
            where: {
                recipientId: userId,
            },
        });
        res.status(200).json({
            messages,
        });
    }
    catch (error) {
        console.log("error fetching messages");
        res.status(500).json({
            message: "errro fetching messages",
        });
    }
}));
exports.default = router;
