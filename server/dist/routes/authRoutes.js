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
function generateUniqueName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let finalUsername = "";
        let isUnique = false;
        while (!isUnique) {
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            finalUsername = `${name}${randomDigits}`;
            const existingusername = yield prisma.user.findUnique({
                where: {
                    username: finalUsername,
                },
            });
            if (!existingusername) {
                isUnique = true;
            }
        }
        return finalUsername;
    });
}
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputUsername = req.body.username;
    if (!inputUsername) {
        res.status(400).json({
            message: "Please provide username.",
        });
        return;
    }
    try {
        // Try to find existing user
        let user = yield prisma.user.findFirst({
            where: {
                displayName: inputUsername,
            },
        });
        // If not found, create one with a unique username
        if (!user) {
            const uniqueUsername = yield generateUniqueName(inputUsername);
            user = yield prisma.user.create({
                data: {
                    username: uniqueUsername,
                    displayName: inputUsername,
                    createdAt: new Date(),
                },
            });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_TOKEN, {
            expiresIn: "7d",
        });
        res.status(200).json({ user, token });
        return;
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Something went wrong." });
        return;
    }
}));
exports.default = router;
