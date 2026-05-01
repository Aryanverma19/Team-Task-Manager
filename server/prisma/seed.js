import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@teamapp.com" },
    update: {},
    create: {
      name: "Project Admin",
      email: "admin@teamapp.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const teamOwner = await prisma.user.upsert({
    where: { email: "member@teamapp.com" },
    update: {},
    create: {
      name: "Team Member",
      email: "member@teamapp.com",
      password: await bcrypt.hash("member123", 10),
      role: "MEMBER",
    },
  });

  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Launch Website",
      description: "Example project for product launch and tracking.",
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id },
          { userId: teamOwner.id },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Design landing page",
      description: "Create responsive homepage wireframes and UI mockups.",
      status: "IN_PROGRESS",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      projectId: project.id,
      assigneeId: teamOwner.id,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
