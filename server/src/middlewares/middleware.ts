import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}
export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    res.status(404).json({
      message: "Unauthorized",
    });
  }
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as {
        id: string;
      };
      req.user = decoded;
    }
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
    return;
  }
};
