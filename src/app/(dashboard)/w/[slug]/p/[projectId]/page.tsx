// src/app/dashboard/w/[slug]/projects/[projectId]/page.tsx
'use client';

import { ProjectClient } from './_components/project-client'
import { useWorkspaceData } from '@/hooks/use-workspace-data'
import { useParams } from 'next/navigation'

const Page = () => {
  const params = useParams();
  const slug = params.slug as string;

  // Ideally, fetch specific project data here too.
  const project = {
    name: "Working",
  };
  
  const { workspace, stats, isLoading, isError, errorMessage } = useWorkspaceData(slug);

  return (
    // Note: Removed DashboardHeader. ProjectClient handles the UI now.
    // Also fixed the projectData prop (removed quotes around {data})
    <ProjectClient projectData={project} workspace={workspace} slug={slug} />
  )
}

export default Page