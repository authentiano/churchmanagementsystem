import { z } from "zod";

export const createFollowUpSchema = z.object({
  body: z.object({
    targetType: z.enum(["Member", "Convert"]),
    targetId: z.string().min(1),
    assignedTo: z.string().optional(),
    scheduledAt: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    notes: z.string().optional(),
  }),
});

export const getFollowUpsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    status: z
      .enum(["Pending", "In Progress", "Contacted", "Completed", "Closed"])
      .optional(),
    assignedTo: z.string().optional(),
    targetType: z.enum(["Member", "Convert"]).optional(),
    search: z.string().optional(),
  }),
});

export const getFollowUpSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const recordAttemptSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    notes: z.string().optional(),
    outcome: z.string().optional(),
    nextAttemptAt: z.string().optional(),
    status: z
      .enum(["Pending", "In Progress", "Contacted", "Completed", "Closed"])
      .optional(),
  }),
});

export const updateFollowUpSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    assignedTo: z.string().optional(),
    scheduledAt: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    status: z
      .enum(["Pending", "In Progress", "Contacted", "Completed", "Closed"])
      .optional(),
  }),
});

export const deleteFollowUpSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
