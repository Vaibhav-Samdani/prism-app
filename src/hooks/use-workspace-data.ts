'use client';
import { useQuery } from "@tanstack/react-query";
import { fetchSingleWorkspace } from "@/lib/api/workspaces";
import { useEffect } from "react";
import { WorkspaceResponse } from "@/types/workspace";

export function useWorkspaceData(slug?: string) {

  const query = useQuery<WorkspaceResponse>({
    queryKey: ["single-workspace", slug],
    queryFn: async () => {
      return fetchSingleWorkspace({slug: slug,id: ""});
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    console.log("1. --------------->",query);
    console.log("2. --------------->",query.data?.data.workspace);
  },[query.data]);

//   useEffect(() => {
//     if (query.isFetched && !query.isLoading && !query.data) {
//       router.push("/dashboard");
//     }
//   }, [query.isFetched, query.isLoading, query.data, router]);

  return {
    workspace: query.data?.data.workspace,
    stats: query.data?.data.stats,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    errorMessage: query.data?.error,
  };
}
