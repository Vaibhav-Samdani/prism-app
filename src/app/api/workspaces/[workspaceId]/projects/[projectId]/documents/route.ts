import { NextResponse } from "next/server";
import { documentCreateSchema } from "@/lib/validations/document";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// Validate the resolved params directly, not the Promise container
const paramsSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string(),
});

// Next.js 15+ requires params to be awaited
type RouteContext = {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    // 1. Await the params Promise
    const resolvedParams = await context.params;
    const params = paramsSchema.parse(resolvedParams);
    
    // 2. Authenticate using your provided method
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify workspace access and project existence concurrently
    const [membership, project] = await Promise.all([
      prisma.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId: session.user.id, workspaceId: params.workspaceId } },
      }),
      prisma.project.findUnique({
        where: { id: params.projectId, workspaceId: params.workspaceId },
      })
    ]);

    if (!membership || !project) {
      return NextResponse.json({ error: "Forbidden or Project Not Found" }, { status: 403 });
    }

    const json = await req.json();
    const body = documentCreateSchema.parse(json);

    const document = await prisma.document.create({
      data: {
        title: body.title,
        type: body.type,
        content: body.content ?? (body.type === "WHITEBOARD" ? [] : {}),
        workspaceId: params.workspaceId,
        projectId: params.projectId,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }
    console.error("[DOCUMENTS_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const resolvedParams = await context.params;
    const params = paramsSchema.parse(resolvedParams);
    
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json([], { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: {
        workspaceId: params.workspaceId,
        projectId: params.projectId,
      },
      // FIX: Added 'content: true' so the frontend actually receives the saved data
      select: {
        id: true,
        title: true,
        type: true,
        content: true, 
        createdAt: true,
        updatedAt: true,
        createdById: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error);
    return NextResponse.json([], { status: 500 });
  }
}