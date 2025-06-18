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
exports.senderMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const senderMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token.split(" ")[1], process.env.JWT_TOKEN);
            const user = yield prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (user) {
                req.user = { id: user.id };
            }
        }
        catch (error) {
            console.warn("Invalid sender token. Proceeding anonymously.");
            // Do not block request, just don't attach user
        }
    }
    next();
});
exports.senderMiddleware = senderMiddleware;
