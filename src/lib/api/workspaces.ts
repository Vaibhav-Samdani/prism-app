import { Workspace, WorkspaceResponse } from "@/types/workspace";

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const res = await fetch("/api/workspaces", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspaces");
  }

  return res.json();
}

export async function fetchSingleWorkspace({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}): Promise<WorkspaceResponse> {
  const res = await fetch(`/api/workspace?id=${id}&slug=${slug}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspace");
  }

  return res.json();
}
