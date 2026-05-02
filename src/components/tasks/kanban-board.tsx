"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, GripVertical } from "lucide-react";
import { useUpdateTask } from "@/hooks/use-tasks"; // Update path if needed
import { toast } from "sonner";

// Define our columns based on the Prisma TaskStatus Enum
const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

interface KanbanBoardProps {
  workspaceId: string;
  projectId: string;
  initialTasks: any[];
}

export function KanbanBoard({ workspaceId, projectId, initialTasks }: KanbanBoardProps) {
  // Prevent Next.js hydration mismatch errors with DnD
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const { mutate: updateTask } = useUpdateTask(workspaceId, projectId);

  useEffect(() => {
    setIsMounted(true);
    setTasks(initialTasks); // Sync local state if server data changes
  }, [initialTasks]);

  if (!isMounted) return null;

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid column
    if (!destination) return;

    // Dropped in the exact same spot
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // 1. Optimistic UI Update (Move it instantly on screen)
    const newStatus = destination.droppableId;
    
    setTasks((prevTasks) => 
      prevTasks.map((task) => 
        task.id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    // 2. Fire the API call in the background
    updateTask(
      { taskId: draggableId, status: newStatus },
      {
        onError: (err) => {
          // If the server fails, revert the card back to where it was
          toast.error("Failed to move task");
          setTasks(initialTasks); 
        }
      }
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full min-w-max pb-4">
        {COLUMNS.map((column) => {
          // Filter tasks for this specific column
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <div key={column.id} className="w-[320px] flex flex-col bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  {column.title}
                  <span className="bg-secondary text-secondary-foreground text-xs py-0.5 px-2 rounded-full">
                    {columnTasks.length}
                  </span>
                </h3>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 flex flex-col gap-3 min-h-[150px] transition-colors rounded-md ${
                      snapshot.isDraggingOver ? "bg-muted/50" : ""
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 shadow-sm border-border/60 group ${
                              snapshot.isDragging ? "shadow-lg ring-1 ring-primary/50 rotate-2" : "hover:border-primary/40"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <p className="text-sm font-medium leading-tight">{task.title}</p>
                              <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-grab active:cursor-grabbing" />
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <Badge variant={task.priority === "URGENT" || task.priority === "HIGH" ? "destructive" : "secondary"} className="text-[10px] uppercase">
                                {task.priority}
                              </Badge>
                              
                              {task.dueDate && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}