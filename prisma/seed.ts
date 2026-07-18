import { WorkspaceRole } from "@/generated/prisma/enums";
import prisma from "@/lib/db";


async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Fetch existing users
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    throw new Error("No users found. Login at least once before seeding.");
  }

  const owner = users[0];
  const member = users[1] ?? users[0]; // fallback for single-user dev

  // 2️⃣ Create Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "prism-dev" },
    update: {},
    create: {
      name: "Prism Dev Workspace",
      slug: "prism-dev",
      ownerId: owner.id,
    },
  });

  // 3️⃣ Create Workspace Members
  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: owner.id,
        workspaceId: workspace.id,
      },
    },
    update: {
      role: WorkspaceRole.OWNER,
    },
    create: {
      userId: owner.id,
      workspaceId: workspace.id,
      role: WorkspaceRole.OWNER,
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: member.id,
        workspaceId: workspace.id,
      },
    },
    update: {
      role: WorkspaceRole.MEMBER,
    },
    create: {
      userId: member.id,
      workspaceId: workspace.id,
      role: WorkspaceRole.MEMBER,
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
