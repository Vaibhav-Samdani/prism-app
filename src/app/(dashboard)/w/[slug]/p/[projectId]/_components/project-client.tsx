// src/app/dashboard/w/[slug]/projects/[projectId]/_components/project-client.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ProjectHeader } from "./project-header";
import { TaskBoard } from "./views/task-board";
import { DocsEditor } from "./views/docs-editor";
import { CanvasBoard } from "./views/canvas-board";

import {Workspace} from "@/types/workspace";

export function ProjectClient({ projectData, workspace, slug }: { projectData: any , workspace: Workspace, slug : string}) {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full w-full">
      {/* Top Context Bar */}
      <ProjectHeader activeTab={activeTab} slug={slug} setActiveTab={setActiveTab} project={projectData} />

      {/* View Switcher Content */}
      <div className="flex-1 overflow-hidden relative">
        <TabsContent value="tasks" className="h-full m-0 data-[state=active]:flex flex-col">
          <TaskBoard tasks={projectData.tasks} />
        </TabsContent>

        <TabsContent value="docs" className="h-full m-0 data-[state=active]:flex flex-col">
          <DocsEditor />
        </TabsContent>

        <TabsContent value="canvas" className="flex-1 m-0 p-6 data-[state=active]:flex flex-col h-full">
  <CanvasBoard />
</TabsContent>
      </div>
    </Tabs>
  );
}