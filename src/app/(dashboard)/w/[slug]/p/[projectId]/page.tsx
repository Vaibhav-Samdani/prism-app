// src/app/dashboard/w/[slug]/projects/[projectId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProjectClient } from './_components/project-client';
import { useWorkspaceData } from '@/hooks/use-workspace-data';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const params = useParams();
  const slug = params.slug as string;
  const projectId = params.projectId as string;

  // 1. Fetch workspace data first
  const { workspace, isLoading: workspaceLoading, isError } = useWorkspaceData(slug);
  
  // 2. Local state for the specific project
  const [project, setProject] = useState<any>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // 3. Fetch the specific project once the workspace ID is available
  useEffect(() => {
    // Prevent fetching if workspace data hasn't loaded yet
    if (!workspace?.id || !projectId) return;

    const fetchProject = async () => {
      try {
        setIsLoadingProject(true);
        // Hits your existing endpoint at src/app/api/workspaces/[workspaceId]/projects/[projectId]/route.ts
        const res = await fetch(`/api/workspaces/${workspace.id}/projects/${projectId}`);
        const result = await res.json();
        if (result.success) {
          setProject(result.data);
        } else {
          console.error("Failed to fetch project data");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [workspace?.id, projectId]);

  // 4. Handle Loading States gracefully
  if (workspaceLoading || isLoadingProject) {
    return (
      <div className="flex w-full h-[calc(100vh-60px)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 5. Handle Errors or Missing Data
  if (isError || !workspace || !project) {
    return (
      <div className="flex w-full h-[calc(100vh-60px)] items-center justify-center text-muted-foreground">
        <p>Project or Workspace not found.</p>
      </div>
    );
  }

  // 6. Render the Client UI with real data (project now has project.id!)
  return (
    <ProjectClient 
      projectData={project} 
      workspace={workspace} 
      slug={slug} 
    />
  );
}

export default Page;