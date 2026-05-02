"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

// 1. Zod Schema (Matches your backend validation)
const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().optional(),
  category: z.string().optional(),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

export default function TestProjectPage() {
  const [result, setResult] = useState<any>(null);

  // 2. React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      workspaceId: "", // You will need to paste a valid workspaceId from your DB here
    },
  });

  // 3. React Query Mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to create project");
      }

      return json;
    },
    onSuccess: (data) => {
      setResult({ status: "Success", data });
    },
    onError: (error: any) => {
      setResult({ status: "Error", message: error.message });
    },
  });

  // 4. Submit Handler
  const onSubmit = (data: CreateProjectInput) => {
    createProjectMutation.mutate(data);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-background border rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">
        Test API: Create Project
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Workspace ID Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Workspace ID (Required)
          </label>
          <input
            {...register("workspaceId")}
            placeholder="Paste a valid UUID from your database"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.workspaceId && (
            <p className="text-red-500 text-sm mt-1">{errors.workspaceId.message}</p>
          )}
        </div>

        {/* Project Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            {...register("name")}
            placeholder="e.g., Prism Refactor"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            placeholder="Optional project description..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Category Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            {...register("category")}
            placeholder="e.g., Engineering, Marketing"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createProjectMutation.isPending}
          className="w-full bg-slate-900 text-white p-2 rounded-md font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {createProjectMutation.isPending ? "Creating..." : "Create Project"}
        </button>
      </form>

      {/* Response Display */}
      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">API Response:</h2>
          <pre
            className={`p-4 rounded-md overflow-auto text-sm ${
              result.status === "Success"
                ? "bg-green-50 text-green-900 border border-green-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}