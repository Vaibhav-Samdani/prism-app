import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();

  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { token },
  });

  if (!invitation || new Date() > invitation.expiresAt) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 400 });
  }

  // Create membership and delete invite in a transaction
  await prisma.$transaction([
    prisma.workspaceMember.create({
      data: {
        userId: session.user.id,
        workspaceId: invitation.workspaceId,
        role: invitation.role, // "MEMBER" or "ADMIN"
      },
    }),
    prisma.workspaceInvitation.delete({
      where: { id: invitation.id },
    }),
  ]);

  return NextResponse.json({ success: true, workspaceId: invitation.workspaceId });
}