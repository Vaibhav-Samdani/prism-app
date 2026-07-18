"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "react-toastify"; // Using the toastify you installed

// Zod Schema
const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().optional(),
  category: z.string().optional(),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  workspaceId: string;
}

export function CreateProjectModal({ workspaceId }: CreateProjectModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", description: "", category: "" },
  });

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Inject the workspaceId from props
        body: JSON.stringify({ ...data, workspaceId }),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to create project");
      return json;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Project created successfully");
      // Invalidate the projects query so the sidebar/list updates instantly
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      setIsOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateProjectInput) => {
    createProject(data);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-xl sm:rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-foreground">
              Create a new project
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Projects group your tasks together. You can add more details later.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                Project Name
              </label>
              <input
                {...register("name")}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Website Redesign"
                autoFocus
              />
              {errors.name && <p className="text-[0.8rem] text-destructive font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Description (Optional)
              </label>
              <textarea
                {...register("description")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="What is this project about?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Category (Optional)
              </label>
              <input
                {...register("category")}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Engineering, Marketing"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-foreground"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Project
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4 text-foreground" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}