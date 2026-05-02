import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects } from "@/lib/api/projects";
import { CreateProjectInput } from "@/lib/validations/project";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Fetch all projects for a workspace
export function useProjects(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(workspaceId!),
    enabled: !!workspaceId, // Only fetch if we have a workspace ID
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// Reusable hook for creating a project
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput & { workspaceId: string }) => createProject(data),
    onSuccess: (_, variables) => {
      
      toast.success("Project created successfully!");
      // Instantly update the UI by invalidating the specific workspace's project cache
      queryClient.invalidateQueries({ queryKey: ["projects", variables.workspaceId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}

export function useUpdateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  
  
  return useMutation({
    mutationFn: async ({ projectId, ...data }: { projectId: string; name?: string; description?: string }) => {
      const res = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // <-- THIS IS CRITICAL
        },
        body: JSON.stringify(data),
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update project");
      return json.data;
    },
    onSuccess: () => {
      
      // 1. Invalidate the specific projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      // 2. IMPORTANT: Invalidate the workspace query! 
      // This forces your "Workspace Single View" to refetch its nested projects
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      
      // 3. Invalidate the main dashboard
      queryClient.invalidateQueries({ queryKey: ["global-dashboard"] });
    },
  });
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete project");
      return json;
    },
    onSuccess: () => {
     
      // 1. Invalidate the specific projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      // 2. IMPORTANT: Invalidate the workspace query! 
      // This forces your "Workspace Single View" to refetch its nested projects
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      
      // 3. Invalidate the main dashboard
      queryClient.invalidateQueries({ queryKey: ["global-dashboard"] });
    },
  });
}