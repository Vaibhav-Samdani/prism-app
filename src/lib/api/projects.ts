import { CreateProjectInput } from "@/lib/validations/project";

export async function createProject(data: CreateProjectInput & { workspaceId: string }) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || "Failed to create project");
  return json;
}

export async function getProjects(workspaceId: string) {
  const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
  const json = await response.json();
  
  if (!response.ok) throw new Error(json.error || "Failed to fetch projects");
  return json;
}