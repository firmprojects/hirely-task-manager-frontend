import { z } from "zod";

export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.date(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

export type Task = z.infer<typeof taskSchema>;