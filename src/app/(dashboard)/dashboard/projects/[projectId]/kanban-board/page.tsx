import Link from "next/link";

import DashboardHeader from "@/components/layout/dashboard-header";
import EmptyState from "@/components/shared/empty-state";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* --------------------------------------------------
   STATUS CONFIG (fixed order)
-------------------------------------------------- */
const STATUSES = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "working", label: "Working" },
  { key: "blocked", label: "Blocked" },
  { key: "delayed", label: "Delayed" },
  { key: "done", label: "Done" },
];

/* --------------------------------------------------
   MOCK TASKS (replace with DB later)
-------------------------------------------------- */
const TASKS = [
  {
    id: "t1",
    title: "Design dashboard layout",
    status: "in_progress",
    priority: "High",
  },
  {
    id: "t2",
    title: "Set up auth flow",
    status: "todo",
    priority: "Medium",
  },
  {
    id: "t3",
    title: "Fix sidebar spacing",
    status: "todo",
    priority: "Low",
  },
  {
    id: "t4",
    title: "Resolve API error",
    status: "blocked",
    priority: "High",
  },
  {
    id: "t5",
    title: "Prepare demo",
    status: "done",
    priority: "Medium",
  },
];

/* --------------------------------------------------
   Page
-------------------------------------------------- */
export default function ProjectBoardPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <>
      {/* Header */}
      <DashboardHeader
        title="Project Board"
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Projects", href: "/dashboard/projects" },
          { label: "Board" },
        ]}
      />

      {/* Board */}
      <div className="px-6 py-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {STATUSES.map((status) => {
            const tasksInColumn = TASKS.filter(
              (task) => task.status === status.key
            );

            return (
              <div
                key={status.key}
                className="w-72 flex-shrink-0"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">
                    {status.label}
                  </h3>
                  <Badge variant="secondary">
                    {tasksInColumn.length}
                  </Badge>
                </div>

                {/* Column body */}
                <div className="space-y-3">
                  {tasksInColumn.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border p-4">
                      <p className="text-sm text-muted-foreground">
                        No tasks
                      </p>
                    </div>
                  ) : (
                    tasksInColumn.map((task) => (
                      <Link
                        key={task.id}
                        href={`/dashboard/tasks/${task.id}`}
                      >
                        <Card className="cursor-pointer hover:border-white/20 transition-colors mb-3">
                          <CardContent className="p-4 space-y-2">
                            <p className="text-sm font-medium">
                              {task.title}
                            </p>

                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
