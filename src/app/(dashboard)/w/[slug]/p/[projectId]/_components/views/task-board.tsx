"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Circle,
  Clock,
  MessageSquare,
  MoreHorizontal,
  SignalHigh,
  SignalMedium,
  Loader2,
  Search,
  Trash2,
  Pencil,
  Sparkles,
} from "lucide-react";

import RichTextEditor from "@/components/ui/rich-text-editor";

// --- HELPER ICONS ---
const StatusIcon = ({ status }: { status: string }) => {
  if (status === "DONE")
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "IN_PROGRESS")
    return <Clock className="w-4 h-4 text-blue-500" />;
  return <Circle className="w-4 h-4 text-muted-foreground" />;
};

const PriorityIcon = ({ priority }: { priority: string }) => {
  if (priority === "URGENT")
    return <SignalHigh className="w-4 h-4 text-red-500" />;
  if (priority === "HIGH")
    return <SignalHigh className="w-4 h-4 text-orange-500" />;
  return <SignalMedium className="w-4 h-4 text-muted-foreground" />;
};

// --- ISOLATED TASK ITEM COMPONENT (With AI Edit) ---
function TaskItem({
  task,
  index,
  isLast,
  workspaceId,
  projectId,
  onTaskChange,
  members,
}: any) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );
  const [editStatus, setEditStatus] = useState(task.status);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editAssignee, setEditAssignee] = useState(
    task.assigneeId || "UNASSIGNED",
  );

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            status: editStatus,
            priority: editPriority,
            assigneeId: editAssignee === "UNASSIGNED" ? null : editAssignee,
          }),
        },
      );
      if (res.ok) {
        setIsEditOpen(false);
        onTaskChange();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setIsSheetOpen(false);
        onTaskChange();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!editTitle) return alert("Please enter a task title first!");
    try {
      setIsGeneratingAI(true);
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/tasks/ai-bullets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
          }),
        },
      );
      const result = await res.json();
      if (result.success) {
        // Append generated HTML to current content
        setEditDescription((prev: string) => `${prev}<br>${result.data}`);
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <div
          className={`group grid grid-cols-[minmax(300px,1fr)_120px_100px_120px_80px] gap-4 items-center px-6 py-3.5 cursor-pointer transition-all hover:bg-muted/40 ${!isLast ? "border-b border-border/50" : ""}`}
        >
          <div className="flex items-center gap-3 font-medium text-sm text-foreground truncate">
            <StatusIcon status={task.status} />
            <span className="truncate group-hover:text-blue-600 transition-colors">
              {task.title}
            </span>
          </div>
          <div>
            <Badge
              variant="outline"
              className="bg-background font-normal text-[10px] px-2 py-0.5 uppercase"
            >
              {task.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <PriorityIcon priority={task.priority} />
            <span className="hidden sm:inline capitalize">
              {task.priority.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task._count?.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{task._count.comments}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Avatar className="w-7 h-7 border-2 border-background shadow-sm bg-muted flex items-center justify-center">
              {task.assignee ? (
                <>
                  <AvatarImage src={task.assignee.image} />
                  <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                    {task.assignee.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </>
              ) : (
                <span className="text-[10px] text-muted-foreground">--</span>
              )}
            </Avatar>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[600px] flex flex-col p-0 border-l border-border bg-background shadow-2xl">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant="secondary"
              className="font-normal text-xs flex items-center gap-1 uppercase"
            >
              <StatusIcon status={task.status} />{" "}
              {task.status.replace("_", " ")}
            </Badge>
            <div className="flex items-center gap-2">
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleUpdateTask}
                    className="flex flex-col space-y-6 mt-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Task Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          Description (Rich Text)
                        </label>
                        <Button
                          type="button"
                          onClick={handleAIGenerate}
                          disabled={isGeneratingAI}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/30 dark:border-purple-900/50 dark:text-purple-400"
                        >
                          {isGeneratingAI ? (
                            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1.5" />
                          )}
                          Add AI Bullet Points
                        </Button>
                      </div>
                      <RichTextEditor
                        content={editDescription}
                        onChange={setEditDescription}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Assignee</label>
                        <Select
                          value={editAssignee}
                          onValueChange={setEditAssignee}
                        >
                          <SelectTrigger className="bg-muted/20">
                            <SelectValue placeholder="Assign someone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UNASSIGNED">
                              Unassigned
                            </SelectItem>
                            {members.map((m: any) => (
                              <SelectItem key={m.userId} value={m.userId}>
                                {m.user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={editStatus}
                          onValueChange={setEditStatus}
                        >
                          <SelectTrigger className="bg-muted/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BACKLOG">Backlog</SelectItem>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="IN_REVIEW">In Review</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select
                          value={editPriority}
                          onValueChange={setEditPriority}
                        >
                          <SelectTrigger className="bg-muted/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}{" "}
                      Save Changes
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the task.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteTask}
                      className="bg-red-500 text-white"
                    >
                      Delete Task
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <SheetTitle className="text-xl font-semibold leading-tight">
            {task.title}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: task.description || "No description provided.",
            }}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// --- MAIN TASK BOARD COMPONENT ---
export function TaskBoard({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskStatus, setNewTaskStatus] = useState("TODO");
  const [newTaskAssignee, setNewTaskAssignee] = useState("UNASSIGNED");

  const fetchData = useCallback(async () => {
    if (!workspaceId || !projectId) return;
    try {
      setIsLoading(true);
      const [tasksRes, membersRes] = await Promise.all([
        fetch(`/api/workspaces/${workspaceId}/projects/${projectId}/tasks`),
        fetch(`/api/workspaces/${workspaceId}/members`),
      ]);
      const tasksResult = await tasksRes.json();
      if (tasksResult.success) setTasks(tasksResult.data);
      if (membersRes.ok) {
        const membersResult = await membersRes.json();
        setMembers(membersResult);
      }
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTaskTitle,
            description: newTaskDescription,
            priority: newTaskPriority,
            status: newTaskStatus,
            assigneeId:
              newTaskAssignee === "UNASSIGNED" ? null : newTaskAssignee,
          }),
        },
      );
      if (res.ok) {
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskPriority("MEDIUM");
        setNewTaskStatus("TODO");
        setNewTaskAssignee("UNASSIGNED");
        setIsCreateOpen(false);
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGenerateCreate = async () => {
    if (!newTaskTitle) return alert("Please enter a task title first!");
    try {
      setIsGeneratingAI(true);
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/tasks/ai-bullets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTaskTitle,
            description: newTaskDescription,
          }),
        },
      );
      const result = await res.json();
      if (result.success) {
        setNewTaskDescription((prev) => {
          const currentContent = prev || "";
          // If content ends in a tag, insert before it, otherwise just append
          return `${currentContent}<br/>${result.data}`;
        });
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFC] dark:bg-zinc-950/50">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="flex-1 overflow-auto bg-[#FAFAFC] dark:bg-zinc-950/50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Current Tasks
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track your active project items.
            </p>
          </div>
          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger asChild>
              <Button className="shadow-sm">Create Task</Button>
            </SheetTrigger>
            <SheetContent className="w-[500px] flex flex-col p-0 bg-background border-l shadow-2xl">
  {/* 1. Header (Sticky) */}
  <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
    <h2 className="text-lg font-semibold">Create New Task</h2>
  </div>

  {/* 2. Scrollable Content (Takes all remaining space) */}
  <ScrollArea className="flex-1 overflow-y-auto">
    <div className="p-6 space-y-6">
      
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Task Title</label>
        <input 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {/* Description with AI + UI Fix */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Description</label>
          <Button 
            type="button" 
            onClick={handleAIGenerateCreate} 
            disabled={isGeneratingAI} 
            variant="outline"
            className="h-8 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {isGeneratingAI ? <Loader2 className="w-3 h-3 mr-2 animate-spin"/> : <Sparkles className="w-3 h-3 mr-2"/>} 
            Auto-generate
          </Button>
        </div>
        <div className="min-h-[200px] border border-input rounded-md overflow-hidden">
           <RichTextEditor value={newTaskDescription} onChange={setNewTaskDescription} />
        </div>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Status</label>
          <Select value={newTaskStatus} onValueChange={setNewTaskStatus}>
            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Priority</label>
          <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </ScrollArea>

  {/* 3. Footer (Sticky, contains buttons) */}
  <div className="p-6 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-muted/5">
    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
    <Button 
      onClick={handleCreateTask} 
      disabled={isSubmitting}
      className="bg-primary px-8"
    >
      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Task"}
    </Button>
  </div>
</SheetContent>
          </Sheet>
        </div>

        {/* ... Rest of existing table layout omitted for brevity ... */}
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="BACKLOG">Backlog</SelectItem>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-[minmax(300px,1fr)_120px_100px_120px_80px] gap-4 px-6 py-3 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div>Task Details</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Meta</div>
            <div className="text-right">Owner</div>
          </div>
          <div className="flex flex-col">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No tasks match your criteria.
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  isLast={index === filteredTasks.length - 1}
                  workspaceId={workspaceId}
                  projectId={projectId}
                  onTaskChange={fetchData}
                  members={members}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
