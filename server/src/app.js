import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));
app.use(errorHandler);

export default app;
