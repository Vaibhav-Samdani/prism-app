"use client";

import { useWorkspaceData } from "@/hooks/use-workspace-data";

import * as Tabs from "@radix-ui/react-tabs";

import { useParams } from "next/navigation";
import { useWorkspaceMembers, usePendingInvites, useRevokeInvite, useUpdateMemberRole, useRemoveMember, useResendInvite, useLeaveWorkspace } from "@/hooks/use-members";
import { Loader2, ShieldAlert, MoreHorizontal, Mail, Users, X, Send, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InviteMemberModal } from "@/components/workspaces/invite-member-modal";
import BackTobutton from "@/components/shared/back-to-button";

export default function MembersPage() {
  const { slug } = useParams();

  const { workspace, isLoading: isWorkspaceLoading } = useWorkspaceData(
    slug as string,
  );
  const { data: members, isLoading: isMembersLoading } = useWorkspaceMembers(
    workspace?.id,
  );
  const { data: invites, isLoading: isInvitesLoading } = usePendingInvites(
    workspace?.id,
  );
  const { mutate: revokeInvite, isPending: isRevoking } = useRevokeInvite();

  const { mutate: updateRole } = useUpdateMemberRole();
  const { mutate: removeMember } = useRemoveMember();

  const { mutate: resendInvite, isPending: isResending } = useResendInvite();

  const { mutate: leaveWorkspace, isPending: isLeaving } = useLeaveWorkspace();

  // Also, determine if the CURRENT user has permission to see these menus
  // You can grab the currentUserRole we injected into the workspace data earlier
  const isAdminOrOwner =
    workspace?.currentUserRole === "ADMIN" ||
    workspace?.currentUserRole === "OWNER";

  if (isWorkspaceLoading || isMembersLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center w-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-4 space-y-8 animate-in fade-in duration-500">
      <BackTobutton />
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manage Access
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Invite team members and manage their roles in{" "}
            <strong>{workspace?.name}</strong>.
          </p>
        </div>
        {workspace?.id && <InviteMemberModal workspaceId={workspace.id} />}
      </div>

      {/* Tabs Section */}
      <Tabs.Root defaultValue="active" className="w-full">
        <Tabs.List className="flex w-full border-b border-border mb-6">
          <Tabs.Trigger
            value="active"
            className="px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all hover:text-foreground outline-none flex items-center gap-2"
          >
            Active Members
            <span className="bg-secondary text-secondary-foreground py-0.5 px-2 rounded-full text-xs">
              {members?.length || 0}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="pending"
            className="px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all hover:text-foreground outline-none flex items-center gap-2"
          >
            Pending Invites
            <span className="bg-secondary text-secondary-foreground py-0.5 px-2 rounded-full text-xs">
              {invites?.length || 0}
            </span>
          </Tabs.Trigger>
        </Tabs.List>

        {/* ACTIVE MEMBERS TAB */}
        <Tabs.Content value="active" className="outline-none focus:ring-0">
          <Card className="bg-card border-border overflow-hidden shadow-sm">
            {!members || members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center mb-4 border border-border">
                  <Users className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  No active members
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  It looks like there is no one in this workspace yet. Use the
                  invite button above to start collaborating.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {members.map((member: any, index: number) => (
                  <div
                    key={member.id}
                    // Reduced padding, added staggered animation using the map index
                    className="flex items-center justify-between p-3 sm:px-4 hover:bg-muted/30 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Slightly smaller avatar for compact look */}
                      <Avatar className="w-9 h-9 border border-border shadow-sm">
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                          {member.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground leading-tight">
                          {member.user.name || "Unknown User"}
                        </span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">
                          {member.user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {member.role === "OWNER" && (
                        <span className="flex items-center text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Owner
                        </span>
                      )}
                      {member.role === "ADMIN" && (
                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          Admin
                        </span>
                      )}
                      {member.role === "MEMBER" && (
                        <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                          Member
                        </span>
                      )}

                      {/* ONLY SHOW DROPDOWN IF REQUESTER IS ADMIN/OWNER AND TARGET IS NOT OWNER */}
                      {isAdminOrOwner && member.role !== "OWNER" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-foreground hover:bg-muted transition-all data-[state=open]:bg-muted"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {member.role === "MEMBER" ? (
                              <DropdownMenuItem 
                                onClick={() => updateRole({ workspaceId: workspace.id, memberId: member.id, role: "ADMIN" })}
                              >
                                Promote to Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => updateRole({ workspaceId: workspace.id, memberId: member.id, role: "MEMBER" })}
                              >
                                Demote to Member
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                              onClick={() => removeMember({ workspaceId: workspace.id, memberId: member.id })}
                            >
                              Remove from workspace
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Tabs.Content>

        {/* PENDING INVITES TAB */}
        <Tabs.Content value="pending" className="outline-none focus:ring-0">
          <Card className="bg-card border-border overflow-hidden shadow-sm">
            {isInvitesLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : !invites || invites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center mb-4 border border-border">
                  <Mail className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  No pending invites
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  You haven't invited anyone recently, or all of your previous
                  invitations have already been accepted.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {invites.map((invite: any, index: number) => (
                  <div
                    key={invite.id}
                    // Reduced padding, added staggered animation using the map index
                    className="flex items-center justify-between p-3 sm:px-4 hover:bg-muted/30 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground leading-tight">
                        {invite.email}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        Invited by{" "}
                        <strong>{invite.inviter?.name || "Someone"}</strong> •
                        Expires in{" "}
                        {Math.ceil(
                          (new Date(invite.expiresAt).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                        {invite.role}
                      </span>

                      {/* NEW RESEND BUTTON */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => workspace?.id && resendInvite({ workspaceId: workspace.id, inviteId: invite.id })}
                        disabled={isResending}
                        className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground border-border hover:text-primary hover:bg-primary/10 transition-all group-hover:opacity-100 focus:opacity-100"
                      >
                        {isResending ? (
                          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3 mr-1.5" />
                        )}
                        Resend
                      </Button>

                      {/* ALWAYS VISIBLE REVOKE BUTTON (Subtle until hover) */}
                      <Button
                        variant="outline"
                        size="sm"
                        // ADD THE ONCLICK HANDLER HERE:
                        onClick={() =>
                          workspace?.id &&
                          revokeInvite({
                            workspaceId: workspace.id,
                            inviteId: invite.id,
                          })
                        }
                        disabled={isRevoking}
                        className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground border-border hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        {/* Show a spinner if this specific button is being clicked */}
                        {isRevoking ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Tabs.Content>
      </Tabs.Root>
      {/* --- DANGER ZONE --- */}
      <div className="pt-10 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <LogOut className="w-4 h-4 text-destructive" />
              Leave Workspace
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Revoke your own access to <strong>{workspace?.name}</strong>. You will lose access to all projects, tasks, and data inside this workspace immediately.
            </p>
          </div>

          {/* SHADCN ALERT DIALOG */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="whitespace-nowrap sm:w-auto w-full font-medium"
                disabled={isLeaving}
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Leaving...
                  </>
                ) : (
                  "Leave Workspace"
                )}
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  This action cannot be undone. You will immediately lose all access to <strong>{workspace?.name}</strong> and its projects. You will need an Administrator to invite you back if you change your mind.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => workspace?.id && leaveWorkspace(workspace.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Yes, leave workspace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
        </div>
      </div>
    </div>
  );
}
