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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    if (!username) {
        res.status(404).json({
            message: "please provide username ",
        });
    }
    try {
        const user = yield prisma.user.upsert({
            where: { username },
            create: {
                username,
                createdAt: new Date(),
            },
            update: {},
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_TOKEN);
        res.status(200).json({
            user,
            token,
        });
    }
    catch (error) {
        console.error("Signup/Login error:", error);
        res.status(500).json({ error: "Something went wrong." });
        return;
    }
}));
