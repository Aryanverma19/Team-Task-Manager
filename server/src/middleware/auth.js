import { verifyToken } from "../utils/jwt.js";
import prisma from "../prisma.js";

export const authGuard = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Session expired or invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
