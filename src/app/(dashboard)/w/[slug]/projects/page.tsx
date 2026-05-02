// src/app/(dashboard)/w/[slug]/projects/page.tsx
"use client";

import { useProjects } from "@/hooks/use-projects";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { useWorkspaceData } from "@/hooks/use-workspace-data"; // Assuming this gets your current workspace
import { Card } from "@/components/ui/card";
import { MorphingSquare } from "@/components/ui/loader";

export default function ProjectsPage() {
  // Assuming your workspace hook provides the current workspace ID based on the URL slug
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspaceData(); 
  
  const { data: projects, isLoading: isProjectsLoading } = useProjects(
    workspace?.id, 
    // "ACTIVE" // Only show active projects on the main list
  );

  if (isWorkspaceLoading || isProjectsLoading) {
    return <div className="flex justify-center mt-20"><MorphingSquare /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace projects.</p>
        </div>
        
        {/* Your shiny new modal! */}
        {workspace?.id && <CreateProjectModal workspaceId={workspace.id} />}
      </div>

      {projects?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No projects found.</p>
          {workspace?.id && <CreateProjectModal workspaceId={workspace.id} />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project: any) => (
            <Card key={project.id} className="p-4 hover:border-ring transition-colors cursor-pointer">
              <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-secondary rounded-md">
                  {project.category || "Uncategorized"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}