import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

async function verifyAdminOrOwner(userId: string, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return membership?.role === "ADMIN" || membership?.role === "OWNER";
}

// PATCH: Edit details
export async function PATCH(req: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, projectId } = await context.params;
    const body = await req.json();
    const { name, description } = body;

    // 1. Verify User Role
    const isAuthorized = await verifyAdminOrOwner(user.id, workspaceId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Only Admins and Owners can modify projects", success: false }, { status: 403 });
    }

    // 2. Verify the project actually belongs to this workspace before updating
    const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existingProject || existingProject.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Project not found in this workspace", success: false }, { status: 404 });
    }

    // 3. Update the project (Only use `id` in the where clause!)
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json({ success: true, data: updatedProject }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}

// DELETE: Permanently remove the project
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, projectId } = await context.params;

    const isAuthorized = await verifyAdminOrOwner(user.id, workspaceId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Only Admins and Owners can delete projects", success: false }, { status: 403 });
    }

    const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existingProject || existingProject.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Project not found in this workspace", success: false }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}