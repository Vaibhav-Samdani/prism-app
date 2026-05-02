// lib/validations/project.ts
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().optional(),
  category: z.string().optional(),
  
  // The backend needs to know which workspace this belongs to
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

// We also export the TypeScript type generated from the schema!
export type CreateProjectInput = z.infer<typeof createProjectSchema>;