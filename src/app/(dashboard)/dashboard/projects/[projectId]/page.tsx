import DashboardHeader from "@/components/layout/dashboard-header";
import EmptyState from "@/components/shared/empty-state";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

/* --------------------------------------------------
   Mock Data (replace later with DB)
-------------------------------------------------- */
const PROJECT = {
  id: "1",
  name: "Prism MVP",
};

const TASKS = [
  {
    id: "t1",
    title: "Design dashboard layout",
    status: "In Progress",
    priority: "High",
    assignee: "Vaibhav",
  },
  {
    id: "t2",
    title: "Set up database schema",
    status: "Todo",
    priority: "Medium",
    assignee: "Unassigned",
  },
];

/* --------------------------------------------------
   Page
-------------------------------------------------- */
export default function ProjectDetailsPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <>
      {/* Header */}
      <DashboardHeader
        title={PROJECT.name}
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Projects", href: "/dashboard/projects" },
          { label: PROJECT.name },
        ]}
        rightSlot={
          <div className="flex gap-2">
            <Link href={"/dashboard/projects/1/kanban-board/"} className= "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 px-3 has-[>svg]:px-2.5 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
              Kanban Board
            </Link>
            <Button size="sm">+ New Task</Button>
          </div>
        }
      />

      {/* Content */}
      <div className="px-6">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* ---------------- Tasks Tab ---------------- */}
          <TabsContent value="tasks" className="mt-6">
            {TASKS.length === 0 ? (
              <EmptyState
                title="No tasks in this project"
                description="Create your first task to start tracking work."
                actionLabel="New task"
                onAction={() => {
                  console.log("Open create task dialog");
                }}
              />
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]" />
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {TASKS.map((task) => (
                      // TODO : Add task details link
                      // TODO : Add type of task (bug, feature, etc.)
                      <TableRow key={task.id} className="hover:bg-white/[0.02]">
                        <TableCell>
                          <Checkbox />
                        </TableCell>

                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary">{task.status}</Badge>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">{task.priority}</Badge>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {task.assignee}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ---------------- Activity Tab ---------------- */}
          <TabsContent value="activity" className="mt-6">
            <EmptyState
              title="No activity yet"
              description="Project activity will appear here."
            />
          </TabsContent>

          {/* ---------------- Settings Tab ---------------- */}
          <TabsContent value="settings" className="mt-6">
            <p className="text-sm text-muted-foreground">
              Project settings will live here.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
