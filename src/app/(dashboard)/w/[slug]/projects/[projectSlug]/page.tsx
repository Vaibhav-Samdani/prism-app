"use client";

import { use } from "react";
import { useTasks } from "@/hooks/use-workspaces"; 
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { Loader2, SquareKanban } from "lucide-react";
import { KanbanBoard } from "@/components/tasks/kanban-board"; // <-- Import it

interface ProjectPageProps {
  params: Promise<{ slug: string; projectSlug: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug, projectSlug } = use(params);

  const { workspace, isLoading: isWorkspaceLoading } = useWorkspaceData(slug);
  
  // Note: projectSlug might be the ID depending on how you set up your routes.
  const { data: tasks, isLoading: isTasksLoading } = useTasks(workspace?.id || "", projectSlug);

  if (isWorkspaceLoading || isTasksLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center w-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <SquareKanban className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground capitalize">
              {projectSlug.replace(/-/g, ' ')}
            </h1>
          </div>
        </div>

        {/* TODO: Build CreateTaskModal -> */}
        
        {/* {workspace?.id && (
          <CreateTaskModal workspaceId={workspace.id} projectId={projectSlug} />
        )} */}
      </div>

      {/* The Interactive Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <KanbanBoard 
          workspaceId={workspace!.id} 
          projectId={projectSlug} 
          initialTasks={tasks || []} 
        />
      </div>
    </div>
  );
}