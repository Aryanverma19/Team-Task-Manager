import express from "express";
import prisma from "../prisma.js";
import { validateTask } from "../utils/validation.js";
import { authGuard } from "../middleware/auth.js";

const router = express.Router();
router.use(authGuard);

const userProjectFilter = (userId) => ({
  OR: [
    { project: { ownerId: userId } },
    { project: { members: { some: { userId } } } },
  ],
});

router.get("/", async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: userProjectFilter(req.user.id),
      include: { project: true, assignee: true },
      orderBy: { dueDate: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const error = validateTask(req.body);
    if (error) return res.status(400).json({ error });

    const project = await prisma.project.findFirst({
      where: {
        id: Number(req.body.projectId),
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
      include: { members: true },
    });

    if (!project) {
      return res.status(403).json({ error: "Project not found or access denied." });
    }

    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
        projectId: Number(req.body.projectId),
        assigneeId: req.body.assigneeId ? Number(req.body.assigneeId) : null,
      },
      include: { assignee: true, project: true },
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put("/:taskId", async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const action = await prisma.task.findFirst({
      where: { id: taskId, ...userProjectFilter(req.user.id) },
    });
    if (!action) {
      return res.status(404).json({ error: "Task not found or access denied." });
    }

    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    if (req.body.assigneeId !== undefined) updateData.assigneeId = req.body.assigneeId ? Number(req.body.assigneeId) : null;

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: { assignee: true, project: true },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default router;
