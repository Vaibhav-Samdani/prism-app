// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/task-board.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TaskBoard({ tasks }: { tasks: any[] }) {
  return (
    <div className="flex-1 p-6 overflow-auto bg-muted/10">
      {/* 
        Placeholder for your Hello Pangea DND Kanban implementation.
        For now, we map a simple list to demonstrate the Sheet integration.
      */}
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {tasks?.map((task) => (
          <Sheet key={task.id}>
            {/* The Task Row (Trigger) */}
            <SheetTrigger asChild>
              <div className="group flex items-center justify-between p-3 border border-border bg-card rounded-lg hover:border-blue-500 cursor-pointer transition-colors shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground group-hover:border-blue-500" />
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={task.assignee?.image} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </SheetTrigger>

            {/* The Slide-over Details Panel */}
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 border-l border-border">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle>{task.title}</SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Task Meta (Assignee, Status, Priority) */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Assignee</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5"><AvatarFallback>VS</AvatarFallback></Avatar>
                        Vaibhav S.
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs dark:bg-blue-900 dark:text-blue-300">In Progress</span>
                    </div>
                  </div>

                  {/* Task Description */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{task.description || "No description provided."}</p>
                  </div>

                  {/* Comments Section (Your new Schema) */}
                  <div className="border-t border-border pt-4 mt-6">
                    <h4 className="font-medium text-sm mb-4">Activity & Comments</h4>
                    {/* Render your Comment Components here */}
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}