import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }

    const { workspaceId } = await params;

    // 1. Check if the user is actually a member of this workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: user.id, workspaceId },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "You are not a member of this workspace", success: false }, { status: 400 });
    }

    // 2. Safeguard: Prevent the ONLY OWNER from leaving
    if (membership.role === "OWNER") {
      const ownersCount = await prisma.workspaceMember.count({
        where: { workspaceId, role: "OWNER" },
      });

      if (ownersCount <= 1) {
        return NextResponse.json({
          error: "You cannot leave because you are the only owner. Transfer ownership or delete the workspace instead.",
          success: false
        }, { status: 400 });
      }
    }

    // 3. Remove the user from the workspace
    await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: { userId: user.id, workspaceId },
      },
    });

    return NextResponse.json({ success: true, message: "Successfully left the workspace" }, { status: 200 });

  } catch (error: any) {
    console.error("Failed to leave workspace:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}