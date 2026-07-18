import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

// GET: Fetch all tasks for a specific project
export async function GET(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, projectId } = await params;

    // Verify workspace access
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!membership) return NextResponse.json({ error: "Forbidden", success: false }, { status: 403 });

    // Fetch Tasks
    const tasks = await prisma.task.findMany({
      where: { projectId, workspaceId },
      orderBy: { createdAt: "desc" },
      include: {
        assignee: { select: { id: true, name: true, image: true } } // Get assignee details for the UI avatars
      }
    });

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}

// POST: Create a new task in a project
export async function POST(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, projectId } = await params;
    const body = await req.json();
    const { title, description, status, priority, dueDate, assigneeId } = body;

    if (!title) return NextResponse.json({ error: "Task title is required", success: false }, { status: 400 });

    // Verify workspace access
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!membership) return NextResponse.json({ error: "Forbidden", success: false }, { status: 403 });

    // Create the task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        workspaceId,
        creatorId: user.id,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, image: true } }
      }
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create task:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}