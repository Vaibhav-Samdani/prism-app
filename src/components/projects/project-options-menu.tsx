"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, FolderOutput, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateProject, useDeleteProject } from "@/hooks/use-projects";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
} from "@/components/ui/alert-dialog";

import { Project } from "@/types/workspace";

interface ProjectOptionsMenuProps {
  workspaceId: string;
  project: Project;
}

export function ProjectOptionsMenu({
  workspaceId,
  project,
}: ProjectOptionsMenuProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const { mutate: updateProject, isPending: isUpdating } =
    useUpdateProject(workspaceId);

  const { mutate: deleteProject, isPending: isDeleting } =
    useDeleteProject(workspaceId);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);

    updateProject(
      {
        projectId: project.id,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      },
      {
        onSuccess: () => {
          toast.success("Project updated successfully");
          setIsEditModalOpen(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit details
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              toast.info("Move feature coming next!");
            }}
          >
            <FolderOutput className="mr-2 h-4 w-4" />
            Move to...
          </DropdownMenuItem> */}

          {/* <DropdownMenuSeparator /> */}

          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onSelect={(e) => {
              e.stopPropagation();
              setIsDeleteAlertOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={project.name}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={project.description || ""}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE ALERT */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{project.name}</strong> and remove all associated tasks
              and data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                deleteProject(project.id, {
                  onSuccess: () => {
                    toast.success("Project deleted");
                    setIsDeleteAlertOpen(false);
                  },
                  onError: (err) => toast.error(err.message),
                });
              }}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}