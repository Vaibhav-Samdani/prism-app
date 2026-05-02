import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { sendWorkspaceInviteEmail } from "@/lib/mail";
import { NextResponse } from "next/server";
// Uncomment this when you have your email service ready
// import { sendWorkspaceInviteEmail } from "@/lib/mail";

interface RouteContext {
  params: Promise<{ workspaceId: string; inviteId: string }>;
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });

    const { workspaceId, inviteId } = await params;

    // 1. Verify the requester is an ADMIN or OWNER
    const inviterMembership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!inviterMembership || inviterMembership.role === "MEMBER") {
      return NextResponse.json(
        { error: "Only Admins and Owners can resend invitations", success: false },
        { status: 403 }
      );
    }

    // 2. Fetch the invitation and workspace details
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { id: inviteId },
      include: { workspace: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found", success: false }, { status: 404 });
    }

    // 3. Extend the expiration date by another 7 days
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await prisma.workspaceInvitation.update({
      where: { id: inviteId },
      data: { expiresAt: newExpiresAt },
    });

    // 4. Fire off the email again
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${invitation.token}`;
    
    // TODO: Uncomment when Nodemailer is configured
    await sendWorkspaceInviteEmail({
      to: invitation.email,
      inviterName: user.name || "A team member",
      workspaceName: invitation.workspace.name,
      inviteLink: inviteLink,
    });

    console.log("-----------------------------------------");
    console.log("RESENT INVITE LINK:", inviteLink);
    console.log("-----------------------------------------");

    return NextResponse.json({ success: true, message: "Invitation resent successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Failed to resend invite:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}