import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const senderMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(
        token.split(" ")[1],
        process.env.JWT_TOKEN!
      ) as {
        id: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (user) {
        req.user = { id: user.id };
      }
    } catch (error) {
      console.warn("Invalid sender token. Proceeding anonymously.");
      // Do not block request, just don't attach user
    }
  }

  next();
};
