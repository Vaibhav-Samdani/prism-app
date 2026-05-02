import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      ...data
    }: {
      taskId: string;
      status?: string;
      title?: string;
      priority?: string;
    }) => {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update task");
      return json.data;
    },
    onSuccess: () => {
      // Silently sync the background cache so data is fresh if they reload
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["global-dashboard"] });
    },
  });
}
