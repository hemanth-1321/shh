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
  console.log("username", req.body);
  const username = req.body.username;

  if (!username) {
    res.status(404).json({
      message: "please provide username ",
    });
  }
  try {
    const FinalUsername = await generateUniqueName(username);
    console.log("final", FinalUsername);
    const user = await prisma.user.upsert({
      where: { username: FinalUsername },
      create: {
        username: FinalUsername,
        displayName: username,
        createdAt: new Date(),
      },
      update: {},
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN!, {
      expiresIn: "7d",
    });
    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    console.error("Signup/Login error:", error);
    res.status(500).json({ error: "Something went wrong." });
    return;
  }
});

export default router;
