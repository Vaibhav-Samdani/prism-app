import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const paramsSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string(),
  documentId: z.string(),
});

type RouteContext = {
  params: Promise<{
    workspaceId: string;
    projectId: string;
    documentId: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    // 1. Await Next.js 15+ params
    const resolvedParams = await context.params;
    const params = paramsSchema.parse(resolvedParams);

    // 2. Authenticate using your session setup
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Verify workspace access
    const membership = await prisma.workspaceMember.findUnique({
      where: { 
        userId_workspaceId: { 
          userId: session.user.id, 
          workspaceId: params.workspaceId 
        } 
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // 4. Perform the update (saves Excalidraw array OR Tiptap JSON)
    const updatedDocument = await prisma.document.update({
      where: {
        id: params.documentId,
      },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
      },
    });

    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error("[DOCUMENT_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Update Error" }, { status: 500 });
  }
}

// Add the DELETE handler while you are here to support deleting documents later
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const resolvedParams = await context.params;
    const params = paramsSchema.parse(resolvedParams);

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.document.delete({
      where: { id: params.documentId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DOCUMENT_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Delete Error" }, { status: 500 });
  }
}