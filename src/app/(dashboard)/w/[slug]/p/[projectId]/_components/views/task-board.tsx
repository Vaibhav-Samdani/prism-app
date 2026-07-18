// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/task-board.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, Circle, Clock, MessageSquare, Paperclip, 
  MoreHorizontal, Calendar, SignalHigh, SignalMedium, Send
} from "lucide-react";

// Expanded Mock Data
const mockTasks = [
  { 
    id: "1", title: "Implement Next-Auth OAuth Providers", status: "In Progress", priority: "High", 
    assignee: { name: "Vaibhav", initials: "VS", image: "" },
    comments: 3, attachments: 1, dueDate: "Tomorrow"
  },
  { 
    id: "2", title: "Design database schema for Comments", status: "Todo", priority: "Medium", 
    assignee: { name: "Pranjal", initials: "PJ", image: "" },
    comments: 0, attachments: 0, dueDate: "Oct 12"
  },
  { 
    id: "3", title: "Fix API route hydration error on load", status: "Done", priority: "Urgent", 
    assignee: { name: "Vaibhav", initials: "VS", image: "" },
    comments: 8, attachments: 2, dueDate: "Today"
  },
];

// Helper for Status Icons
const StatusIcon = ({ status }: { status: string }) => {
  if (status === "Done") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "In Progress") return <Clock className="w-4 h-4 text-blue-500" />;
  return <Circle className="w-4 h-4 text-muted-foreground" />;
};

// Helper for Priority Icons
const PriorityIcon = ({ priority }: { priority: string }) => {
  if (priority === "Urgent") return <SignalHigh className="w-4 h-4 text-red-500" />;
  if (priority === "High") return <SignalHigh className="w-4 h-4 text-orange-500" />;
  return <SignalMedium className="w-4 h-4 text-muted-foreground" />;
};

export function TaskBoard({ tasks = mockTasks }: { tasks?: any[] }) {
  return (
    <div className="flex-1 overflow-auto bg-[#FAFAFC] dark:bg-zinc-950/50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Modern Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Current Tasks</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage and track your active project items.</p>
          </div>
          <Button className="shadow-sm">Create Task</Button>
        </div>

        {/* List Container */}
        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
          
          {/* Table Header Row */}
          <div className="grid grid-cols-[minmax(300px,1fr)_120px_100px_120px_80px] gap-4 px-6 py-3 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div>Task Details</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Meta</div>
            <div className="text-right">Owner</div>
          </div>

          {/* Task Items */}
          <div className="flex flex-col">
            {tasks.map((task, index) => (
              <Sheet key={task.id}>
                <SheetTrigger asChild>
                  {/* Premium Task Row */}
                  <div className={`
                    group grid grid-cols-[minmax(300px,1fr)_120px_100px_120px_80px] gap-4 items-center px-6 py-3.5 
                    cursor-pointer transition-all hover:bg-muted/40
                    ${index !== tasks.length - 1 ? 'border-b border-border/50' : ''}
                  `}>
                    
                    {/* Title & Icon */}
                    <div className="flex items-center gap-3 font-medium text-sm text-foreground truncate">
                      <StatusIcon status={task.status} />
                      <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <Badge variant="outline" className="bg-background font-normal text-xs px-2 py-0.5">
                        {task.status}
                      </Badge>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PriorityIcon priority={task.priority} />
                      <span className="hidden sm:inline">{task.priority}</span>
                    </div>

                    {/* Meta (Comments, Attachments, Dates) */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1 hidden lg:flex">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Assignee */}
                    <div className="flex justify-end">
                      <Avatar className="w-7 h-7 border-2 border-background shadow-sm">
                        <AvatarImage src={task.assignee.image} />
                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                  </div>
                </SheetTrigger>

                {/* --- THE SHEET: Task Detail & Comment Layout --- */}
                <SheetContent className="w-[400px] sm:w-[600px] flex flex-col p-0 border-l border-border bg-background shadow-2xl">
                  
                  {/* Sheet Header */}
                  <SheetHeader className="px-6 py-5 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="font-normal text-xs flex items-center gap-1">
                        <StatusIcon status={task.status} /> {task.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <SheetTitle className="text-xl font-semibold leading-tight">{task.title}</SheetTitle>
                  </SheetHeader>

                  {/* Scrollable Content */}
                  <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                      
                      {/* Meta Grid */}
                      <div className="grid grid-cols-2 gap-6 p-4 rounded-lg border border-border bg-muted/20">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">Assignee</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6"><AvatarFallback className="text-[10px]">{task.assignee.initials}</AvatarFallback></Avatar>
                            <span className="text-sm font-medium">{task.assignee.name}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">Due Date</p>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {task.dueDate || "No date set"}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          This is a detailed description of the task. In a real app, this would be rich text coming from your database.
                        </p>
                      </div>

                      <Separator />

                      {/* Comments Section */}
                      <div>
                        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Activity & Comments
                        </h4>
                        
                        <div className="space-y-5">
                          {/* Mock Comment 1 */}
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8"><AvatarFallback>PJ</AvatarFallback></Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-sm font-medium">Pranjal</span>
                                <span className="text-xs text-muted-foreground">2 hours ago</span>
                              </div>
                              <p className="text-sm text-foreground bg-muted/40 p-3 rounded-tr-xl rounded-b-xl border border-border/50">
                                I've started looking into the database schema for this. Will update soon.
                              </p>
                            </div>
                          </div>

                          {/* Mock Activity (Status Change) */}
                          <div className="flex gap-3 items-center ml-2">
                            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                              <Clock className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Vaibhav</span> changed status to In Progress
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </ScrollArea>

                  {/* Comment Input Footer (Sticky) */}
                  <div className="p-4 border-t border-border bg-background">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 shrink-0"><AvatarFallback>VS</AvatarFallback></Avatar>
                      <div className="relative flex-1">
                        <Textarea 
                          placeholder="Write a comment..." 
                          className="min-h-[80px] pr-12 resize-none bg-muted/20 focus-visible:ring-1"
                        />
                        <Button size="icon" className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-sm">
                          <Send className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                </SheetContent>
              </Sheet>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}