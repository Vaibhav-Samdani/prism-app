"use client";

import { useState } from "react";

import DashboardHeader from "@/components/layout/dashboard-header";
import TaskStatusDropdown from "@/components/tasks/task-status-dropdown";
import TaskActivityLog from "@/components/tasks/task-activity-log";
import TaskComments from "@/components/tasks/task-comments";
import EmptyState from "@/components/shared/empty-state";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

/* --------------------------------------------------
   HARD-CODED (single source for now)
-------------------------------------------------- */
const TASK_STATUS = "in_progress";

/* --------------------------------------------------
   Mock Data
-------------------------------------------------- */
const TASK = {
  title: "Design dashboard layout",
  description: "Create a clean, Linear-like dashboard layout.",
  priority: "High",
  assignee: "Vaibhav",
};

const SUBTASKS = [
  { id: "s1", title: "Sidebar layout", done: true },
  { id: "s2", title: "Header and breadcrumbs", done: false },
];

const COMMENTS = [
  {
    id: "c1",
    author: "Vaibhav",
    content: "We should keep the layout minimal.",
    createdAt: "1h ago",
    parentCommentId: null,
  },
  {
    id: "c2",
    author: "Teammate",
    content: "Agree. Linear-like spacing works best.",
    createdAt: "45m ago",
    parentCommentId: "c1",
  },
  {
    id: "c3",
    author: "Teammate",
    content: "Agree. Linear-like spacing works best.",
    createdAt: "45m ago",
    parentCommentId: null,
  },
  {
    id: "c4",
    author: "Teammate",
    content: "Agree. Linear-like spacing works best.",
    createdAt: "45m ago",
    parentCommentId: "c3",
  },
];

/* --------------------------------------------------
   Page
-------------------------------------------------- */

// TODO: make the description rich text editable
// TODO: make the subtasks manageable (add/delete/edit)

export default function TaskDetailsPage() {
  const [activityLogs, setActivityLogs] = useState([
    {
      id: "a1",
      actor: "Vaibhav",
      action: "created this task",
      timestamp: "2h ago",
    },
  ]);

  function handleStatusClick(newStatusLabel: string) {
    setActivityLogs((prev) => [
      {
        id: crypto.randomUUID(),
        actor: "Vaibhav",
        action: `changed status to ${newStatusLabel}`,
        timestamp: "just now",
      },
      ...prev,
    ]);
  }

  const statusLabel = TASK_STATUS
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <>
      {/* Header */}
      <DashboardHeader
        title={TASK.title}
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Projects", href: "/dashboard/projects" },
          { label: "Task" },
        ]}
        rightSlot={
          <TaskStatusDropdown
            value={TASK_STATUS}
            onChange={handleStatusClick}
          />
        }
      />

      {/* Layout */}
      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 max-w-6xl">
        {/* ================= LEFT ================= */}
        <div className="space-y-8">
          {/* Description */}
          <section>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {TASK.description}
            </p>
          </section>

          {/* Subtasks */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium">Subtasks</h3>

            {SUBTASKS.length === 0 ? (
              <EmptyState
                title="No subtasks"
                description="Break this task into smaller steps."
              />
            ) : (
              <div className="space-y-2">
                {SUBTASKS.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3"
                  >
                    <Checkbox checked={subtask.done} />
                    <span
                      className={`text-sm ${
                        subtask.done
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* Comments */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium">Comments</h3>
            <TaskComments comments={COMMENTS} />
          </section>
        </div>

        {/* ================= RIGHT ================= */}
        <aside className="space-y-6">
          {/* Meta */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="secondary">{statusLabel}</Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Priority</span>
              <Badge variant="outline">{TASK.priority}</Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Assignee</span>
              <span>{TASK.assignee}</span>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h4 className="text-sm font-medium">Activity</h4>
            <TaskActivityLog logs={activityLogs} />
          </div>
        </aside>
      </div>
    </>
  );
}
