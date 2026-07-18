import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET: Fetch all projects for a workspace
export async function GET(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId } = await params;

    // 1. Verify membership
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!membership) return NextResponse.json({ error: "Forbidden", success: false }, { status: 403 });

    // 2. Fetch projects
    const projects = await prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { tasks: true } } // Handy for showing "12 Tasks" on the UI
      }
    });

    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}

// POST: Create a new project
export async function POST(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId } = params;
    const body = await req.json();
    const { name, description } = body;

    if (!name) return NextResponse.json({ error: "Project name is required", success: false }, { status: 400 });

    // 1. Verify membership (Any member can create a project, or you can restrict to ADMIN/OWNER)
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!membership) return NextResponse.json({ error: "Forbidden", success: false }, { status: 403 });

    // 2. Generate a unique slug for the project URL (e.g., "marketing-campaign-abc1")
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    // 3. Create the project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        slug,
        workspaceId,
        createdById: user.id,
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}