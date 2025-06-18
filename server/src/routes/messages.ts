import { Router } from "express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { senderMiddleware } from "../middlewares/senderMiddleware";
import { middleware } from "../middlewares/middleware";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post("/:username", senderMiddleware, async (req, res) => {
  const { content } = req.body;
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
    console.log("Token/user lookup failed. Proceeding anonymously.");
    // Proceeding anonymously, so no error response here
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        recipientId: recipient.id,
        isAnonymous,
      },
    });

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
  console.log("user", userId);
  try {
    const messages = await prisma.message.findMany({
      where: {
        recipientId: userId,
      },
    });
    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log("error fetching messages");
    res.status(500).json({
      message: "errro fetching messages",
    });
  }
});
export default router;

//id is also chjanges ion evrey login so i canot get teh messages
