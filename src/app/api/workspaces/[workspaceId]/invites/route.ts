import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createInviteSchema } from "@/lib/validations/invite";
import { z } from "zod";
import crypto from "crypto";
import prisma from "@/lib/db";
import { sendWorkspaceInviteEmail } from "@/lib/mail";
import { requireUser } from "@/lib/db/users";

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

interface RouteDELETEContext {
  params: Promise<{ workspaceId: string; inviteId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await params;
    const json = await req.json();
    const body = createInviteSchema.parse(json);

    // 1. Verify the current user is an ADMIN or OWNER of this workspace
    const inviterMembership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!inviterMembership || inviterMembership.role === "MEMBER") {
      return NextResponse.json(
        { error: "Only Admins and Owners can invite new members" },
        { status: 403 },
      );
    }

    // 2. Check if the user is ALREADY a member
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser) {
      const existingMembership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: existingUser.id,
            workspaceId: workspaceId,
          },
        },
      });

      if (existingMembership) {
        return NextResponse.json(
          { error: "User is already a member of this workspace" },
          { status: 400 },
        );
      }
    }

    // 3. Check if a pending invite already exists for this email
    const existingInvite = await prisma.workspaceInvitation.findUnique({
      where: {
        workspaceId_email: { workspaceId: workspaceId, email: body.email },
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this email" },
        { status: 400 },
      );
    }

    // 4. Generate secure token & expiration (7 days from now)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 5. Create the invitation in the database
    const invitation = await prisma.workspaceInvitation.create({
      data: {
        email: body.email,
        workspaceId: workspaceId,
        role: body.role,
        token: token,
        expiresAt: expiresAt,
        inviterId: session.user.id,
      },
    });

    // TODO: Integrate email sending service (Resend, Nodemailer, etc.) here
    // await sendInviteEmail({ to: body.email, token, workspaceName });

    // For now, we return the invitation link so you can test it locally
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${token}`;

    // Get the workspace and inviter details to make the email look good
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    // Fire off the email!
    await sendWorkspaceInviteEmail({
      to: body.email,
      inviterName: session.user.name || "A team member",
      workspaceName: workspace?.name || "A workspace",
      inviteLink: inviteLink,
    });

    return NextResponse.json(
      {
        message: "Invitation sent successfully",
        invitation,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Failed to create invite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await params;

    // Verify user has access to this workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all pending invites
    const invites = await prisma.workspaceInvitation.findMany({
      where: { workspaceId: workspaceId },
      orderBy: { createdAt: "desc" },
      include: {
        inviter: { select: { name: true, email: true, image: true } },
      },
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error("Failed to fetch invites:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
