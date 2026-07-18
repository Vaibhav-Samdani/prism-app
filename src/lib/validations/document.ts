import { z } from "zod";

export const documentCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  type: z.enum(["TEXT", "WHITEBOARD"]),
  // content can be anything (Excalidraw array or Tiptap JSON), but we default to an empty structure
  content: z.any().optional(), 
});

export const documentUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.any().optional(),
});