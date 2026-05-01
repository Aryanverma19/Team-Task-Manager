import express from "express";
import prisma from "../prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { validateSignup, validateLogin } from "../utils/validation.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const error = validateSignup(req.body);
    if (error) return res.status(400).json({ error });

    const existing = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (existing) {
      return res.status(409).json({ error: "Email already in use." });
    }

const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await hashPassword(req.body.password),
        role: req.body.role || "MEMBER",
      },
    });

    const token = signToken({ userId: user.id, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const error = validateLogin(req.body);
    if (error) return res.status(400).json({ error });

    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const passwordMatches = await comparePassword(req.body.password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = signToken({ userId: user.id, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

export default router;
