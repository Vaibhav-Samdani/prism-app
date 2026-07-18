import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Fetch Active Members
export function useWorkspaceMembers(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${workspaceId}/members`);
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json();
    },
    enabled: !!workspaceId,
  });
}

// Fetch Pending Invitations (Hitting the Phase 2 API we built earlier)
export function usePendingInvites(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["invites", workspaceId],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${workspaceId}/invites`);
      if (!res.ok) throw new Error("Failed to fetch invites");
      
      const json = await res.json();
      
      // FIX: If the API wrapped it in { data: [...] }, extract it. 
      // Otherwise, just return the json array.
      return Array.isArray(json.data) ? json.data : json; 
    },
    enabled: !!workspaceId,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, email, role }: { workspaceId: string, email: string, role: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to send invitation");
      return json;
    },
    onSuccess: (data, variables) => {
      toast.success("Invitation sent successfully!");
      // Instantly update the "Pending Invites" tab
      queryClient.invalidateQueries({ queryKey: ["invites", variables.workspaceId] });
      
      // FOR LOCAL TESTING: Log the mock link so you can click it!
      if (data.mockInviteLink) {
        console.log("TESTING LINK:", data.mockInviteLink);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}


export function useRevokeInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, inviteId }: { workspaceId: string, inviteId: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/invites/${inviteId}`, {
        method: "DELETE",
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to revoke invitation");
      return json;
    },
    onSuccess: (_, variables) => {
      toast.success("Invitation revoked");
      // Instantly remove it from the UI by refetching the pending invites
      queryClient.invalidateQueries({ queryKey: ["invites", variables.workspaceId] });
    },
    onError: (error: any) => {
      toast.error(error.message);
      console.log(error);
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, memberId, role }: { workspaceId: string, memberId: string, role: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to update role");
      return json;
    },
    onSuccess: (_, variables) => {
      toast.success("Member role updated");
      queryClient.invalidateQueries({ queryKey: ["members", variables.workspaceId] });
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, memberId }: { workspaceId: string, memberId: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to remove member");
      return json;
    },
    onSuccess: (_, variables) => {
      toast.success("Member removed from workspace");
      queryClient.invalidateQueries({ queryKey: ["members", variables.workspaceId] });
    },
    onError: (error: any) => toast.error(error.message),
  });
}


export function useResendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, inviteId }: { workspaceId: string, inviteId: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/invites/${inviteId}/resend`, {
        method: "POST",
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to resend invitation");
      return json;
    },
    onSuccess: (_, variables) => {
      toast.success("Invitation resent successfully!");
      // Refresh the invites list to show the new expiration date
      queryClient.invalidateQueries({ queryKey: ["invites", variables.workspaceId] });
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useLeaveWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/leave`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to leave workspace");
      return json;
    },
    onSuccess: () => {
      toast.success("You have left the workspace");
      // Force refresh the global workspaces list so the sidebar updates
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      
      // Kick them out to the main dashboard
      router.push("/dashboard");
    },
    onError: (error: any) => toast.error(error.message),
  });
}