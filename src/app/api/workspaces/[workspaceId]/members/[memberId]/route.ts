import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ workspaceId: string; memberId: string }>;
}

// Ensure the requester has permission to modify members
async function verifyAdminOrOwner(userId: string, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return membership?.role === "ADMIN" || membership?.role === "OWNER";
}

// PATCH: Change a member's role
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, memberId } = await params;
    const { role } = await req.json(); // "ADMIN" or "MEMBER"

    const isAuthorized = await verifyAdminOrOwner(user.id, workspaceId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Only Admins and Owners can change roles", success: false }, { status: 403 });
    }

    // Prevent changing the Owner's role
    const targetMember = await prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (targetMember?.role === "OWNER") {
      return NextResponse.json({ error: "Cannot change the Workspace Owner's role", success: false }, { status: 403 });
    }

    const updatedMember = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role },
    });

    return NextResponse.json({ success: true, data: updatedMember }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update role:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}

// DELETE: Remove a member from the workspace
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, memberId } = await params;

    const isAuthorized = await verifyAdminOrOwner(user.id, workspaceId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Only Admins and Owners can remove members", success: false }, { status: 403 });
    }

    // Prevent removing the Owner
    const targetMember = await prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (targetMember?.role === "OWNER") {
      return NextResponse.json({ error: "Cannot remove the Workspace Owner", success: false }, { status: 403 });
    }

    await prisma.workspaceMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ success: true, message: "Member removed" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to remove member:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}