"use client";

import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, FolderKanban, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createProjectSchema } from "@/lib/validations/project";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { useCreateProject } from "@/hooks/use-projects";
import { toast } from "react-toastify";
import BackTobutton from "@/components/shared/back-to-button";


const formSchema = createProjectSchema.omit({ workspaceId: true });
type FormValues = z.infer<typeof formSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const { slug } = useParams();

  const {
    workspace,
    isLoading: isWorkspaceLoading,
  } = useWorkspaceData(slug as string);

  // 1. Pull the mutate function and loading state from our custom hook
  const { mutate: createProject, isPending } = useCreateProject();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", category: "" },
  });

  // 2. Clean, focused submit function
  function onSubmit(values: FormValues) {
    if (!workspace?.id) {
      toast.error("Workspace ID is missing! Cannot create project.");
      console.error("Workspace object state:", workspace);
      router.push(`/dashboard/w/${slug}`);
      return;
    }

    console.log("Submitting with workspace ID:", workspace.id);

    createProject(
      { ...values, workspaceId: workspace.id },
      {
        onSuccess: () => {
          router.push(`/dashboard/w/${slug}`);
        },
      },
    );
  }

  if (isWorkspaceLoading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center w-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackTobutton />

      <Card className="border-border shadow-sm bg-card sm:p-4">
        <CardHeader className="space-y-2 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <FolderKanban className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-3xl tracking-tight">
              Create New Project
            </CardTitle>
          </div>
          <CardDescription className="text-base text-muted-foreground ml-[3.25rem]">
            Group related tasks, set milestones, and track progress together.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-base">
                      Project Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Q3 Roadmap, Website Redesign"
                        autoFocus
                        className="w-full h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-base">
                      Categories
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Development, Marketing, Mobile"
                        className="w-full h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground">
                      Separate multiple categories with commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-base">
                      Description
                    </FormLabel>
                    <FormControl>
                      <div className="min-h-[150px]">
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="What is the main goal of this project?"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-8 mt-10">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="hover:bg-accent h-11 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
