// src/app/invite/[token]/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { InviteClient } from "./invite-client";
import { FolderKanban, AlertCircle } from "lucide-react";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  // Pre-fetch basic info to show the Workspace name immediately
  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { token },
    include: { 
      workspace: { select: { name: true, id: true } },
      inviter: { select: { name: true } }
    },
  });

  if (!invitation || new Date() > invitation.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-xl font-bold">Invite Expired</h1>
          <p className="text-muted-foreground">This link is no longer valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="z-10 mb-8 flex items-center gap-2">
        <FolderKanban className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold">Prism</span>
      </div>
      <InviteClient 
        invitation={invitation} 
        session={session} 
        token={token} 
      />
    </div>
  );
}