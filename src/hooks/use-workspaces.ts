import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWorkspaces } from "@/lib/api/workspaces";
import { useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useRouter } from "next/navigation";
import { Workspace } from "@/types/workspace";

export function useWorkspaces() {
  const router = useRouter();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();

  const query = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Set default active workspace (once)
  useEffect(() => {
    if (!activeWorkspaceId && query.data && query.data.length > 0) {
      setActiveWorkspaceId(query.data[0].id);
    }
  }, [query.data, activeWorkspaceId, setActiveWorkspaceId]);

  useEffect(() => {
    if (
      query.isFetched &&
      !query.isLoading &&
      (query.data?.length === 0 || !query.data)
    ) {
      router.push("/dashboard/onboarding");
    }
  }, [query.isFetched, query.isLoading, query.data, router]);

  return {
    workspaces: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    activeWorkspaceId,
    setActiveWorkspaceId,
  };
}




// --- TASK HOOKS ---

export function useTasks(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}/tasks`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    enabled: !!workspaceId && !!projectId,
  });
}

export function useCreateTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}/tasks`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["global-dashboard"] });
    },
  });
}
