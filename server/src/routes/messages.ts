import { Router } from "express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { senderMiddleware } from "../middlewares/senderMiddleware";
import { middleware } from "../middlewares/middleware";
import { WebSocket } from "ws";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Send a message to a user
router.post("/:username", senderMiddleware, async (req, res) => {
  const { question, content } = req.body;
  const { username } = req.params;

  const recipient = await prisma.user.findUnique({
    where: { username },
  });

  if (!recipient) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  let senderId: string | null = null;
  let isAnonymous = true;

  try {
    if (req.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (user) {
        senderId = user.id;
        isAnonymous = false;
      }
    }
  } catch (error) {
    console.log("Token lookup failed. Proceeding anonymously.");
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        recipientId: recipient.id,
        isAnonymous,
        question,
      },
    });

    const clients = req.app.get("clients") as Map<string, WebSocket>;
    const ws = clients.get(recipient.id);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "new_message",
          message,
        })
      );
    }

    res.status(201).json({ message: "Message sent", data: message });
    return;
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ message: "Failed to send message" });
    return;
  }
});

router.get("/bulk", middleware, async (req, res) => {
  const userId = req.user?.id;
  try {
    const messages = await prisma.message.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ messages });
    return;
  } catch (error) {
    console.log("Error fetching messages", error);
    res.status(500).json({ message: "Error fetching messages" });
    return;
  }
});

export default router;
