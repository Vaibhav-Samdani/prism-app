import { useQuery } from "@tanstack/react-query";
import { fetchWorkspaces } from "@/lib/api/workspaces";
import { useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useRouter } from "next/navigation";
import { Workspace } from "@/types/stores";

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
    } else {
      router.push("/dashboard");
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
