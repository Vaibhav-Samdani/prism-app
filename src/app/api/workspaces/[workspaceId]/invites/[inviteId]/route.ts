import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

interface RouteContext {
  params: { workspaceId: string; inviteId: string };
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }

    const { workspaceId, inviteId } = await params;

    // 1. Verify the person making the request is an ADMIN or OWNER
    const inviterMembership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: user.id, workspaceId },
      },
    });

    if (!inviterMembership || inviterMembership.role === "MEMBER") {
      return NextResponse.json(
        { error: "Only Admins and Owners can revoke invitations", success: false },
        { status: 403 }
      );
    }

    // 2. Delete the invitation
    await prisma.workspaceInvitation.delete({
      where: { id: inviteId },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Invitation revoked successfully" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Failed to revoke invite:", error);
    // Prisma throws a specific error if the record doesn't exist
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Invitation not found", success: false }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}