import { Workspace } from "@/types/stores";


export async function fetchWorkspaces(): Promise<Workspace[]> {
  const res = await fetch("/api/workspaces", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspaces");
  }

  return res.json();
}
