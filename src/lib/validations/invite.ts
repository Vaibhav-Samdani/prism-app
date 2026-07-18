import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.email("Please enter a valid email address"),
  role: z.enum(["MEMBER", "ADMIN"]).default("MEMBER"),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;