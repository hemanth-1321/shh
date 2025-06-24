import { Router } from "express";
import express from "express";
import jwt from "jsonwebtoken";
const router: Router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function generateUniqueName(name: string) {
  let finalUsername = "";
  let isUnique = false;
  while (!isUnique) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    finalUsername = `${name}${randomDigits}`;
    const existingusername = await prisma.user.findUnique({
      where: {
        username: finalUsername,
      },
    });
    if (!existingusername) {
      isUnique = true;
    }
  }
  return finalUsername;
}

router.post("/login", async (req, res) => {
  console.log("req", req.body);
  const inputUsername = req.body.username;

  if (!inputUsername) {
    res.status(400).json({
      message: "Please provide username.",
    });
    return;
  }

  try {
    // Try to find existing user
    let user = await prisma.user.findFirst({
      where: {
        displayName: inputUsername,
      },
    });

    // If not found, create one with a unique username
    if (!user) {
      const uniqueUsername = await generateUniqueName(inputUsername);
      user = await prisma.user.create({
        data: {
          username: uniqueUsername,
          displayName: inputUsername,
          createdAt: new Date(),
        },
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN!, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong." });
    return;
  }
});

export default router;
