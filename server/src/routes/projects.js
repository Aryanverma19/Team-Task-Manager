import express from "express";
import prisma from "../prisma.js";
import { validateProject } from "../utils/validation.js";
import { authGuard, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authGuard);

router.get("/", async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
      include: {
        owner: true,
        members: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const error = validateProject(req.body);
    if (error) return res.status(400).json({ error });

    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        ownerId: req.user.id,
        members: { create: { userId: req.user.id } },
      },
      include: { owner: true, members: { include: { user: true } } },
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

router.get("/:projectId", async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
      include: {
        owner: true,
        members: { include: { user: true } },
        tasks: {
          include: { assignee: true },
          orderBy: { dueDate: "asc" },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found or access denied." });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.post("/:projectId/members", requireAdmin, async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId, userId: user.id } },
      update: {},
      create: { projectId, userId: user.id },
    });

    res.json({ message: "Member added to project." });
  } catch (error) {
    next(error);
  }
});

export default router;
