import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { rewriteDocument } from "@/lib/langgraph/doc-agent";

type RouteContext = {
  params: Promise<{ workspaceId: string; documentId: string }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId, documentId } = await context.params;
    const { content } = await req.json();

    // Verify workspace membership
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
    });
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const improvedHtml = await rewriteDocument(content);

    return NextResponse.json({ success: true, data: improvedHtml }, { status: 200 });
  } catch (error) {
    console.error("[AI_REWRITE_ERROR]", error);
    return NextResponse.json({ error: "Failed to rewrite document" }, { status: 500 });
  }
}