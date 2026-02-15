'use client';
import { useQuery } from "@tanstack/react-query";
import { fetchSingleWorkspace } from "@/lib/api/workspaces";
import { useEffect } from "react";
import { Workspace, WorkspaceResponse, WorkspaceStats } from "@/types/workspace";

export function useWorkspaceData(slug?: string) {

  const query = useQuery<WorkspaceResponse>({
    queryKey: ["single-workspace", slug],
    queryFn: async () => {
      return fetchSingleWorkspace({slug: slug,id: ""});
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    console.log("--------------->",query);
    console.log("--------------->",query.data?.data.workspace);
  });

//   useEffect(() => {
//     if (query.isFetched && !query.isLoading && !query.data) {
//       router.push("/dashboard");
//     }
//   }, [query.isFetched, query.isLoading, query.data, router]);

  return {
    workspace: query.data?.data.workspace ?? {} as Workspace,
    stats: query.data?.data.stats ?? {} as WorkspaceStats,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
