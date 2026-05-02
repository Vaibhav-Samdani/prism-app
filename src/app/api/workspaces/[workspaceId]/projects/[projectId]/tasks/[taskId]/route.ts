import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ workspaceId: string; projectId: string; taskId: string }>;
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, projectId, taskId } = await context.params;
    const body = await req.json();
    const { title, description, status, priority, dueDate, assigneeId } = body;

    // Verify workspace access
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden", success: false }, { status: 403 });
    }

    // Update the task status (and anything else passed in)
    const updatedTask = await prisma.task.update({
      where: { id: taskId, projectId }, // Ensures task belongs to the right project
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
    });

    return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update task:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}