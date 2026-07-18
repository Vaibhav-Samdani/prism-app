import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
// Import your newly extracted AI logic
import { generateTaskBullets } from "@/lib/langgraph/task-agent";

type RouteContext = {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await context.params;
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: "Task title is required to generate context" }, { status: 400 });
    }

    // 2. Verify workspace access for security
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
    });
    
    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Trigger the LangGraph Agent
    const generatedHtml = await generateTaskBullets(title, description);

    // 4. Return the result to the frontend
    return NextResponse.json({ success: true, data: generatedHtml }, { status: 200 });
    
  } catch (error) {
    console.error("[AI_BULLETS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}