import { z } from "zod";

export const createConvertSchema = z.object({
  body: z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional(),
    phone: z.string().min(7).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    dateOfSalvation: z.string().optional(),
    evangelist: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateConvertSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().optional(),
    phone: z.string().min(7).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    dateOfSalvation: z.string().optional(),
    evangelist: z.string().optional(),
    assignedFollowUp: z.string().optional(),
    followUpStatus: z
      .enum(["Pending", "In Progress", "Contacted", "Converted", "Baptized", "Closed"])
      .optional(),
    baptismDate: z.string().optional(),
    joinedCell: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const getConvertsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    status: z
      .enum(["Pending", "In Progress", "Contacted", "Converted", "Baptized", "Closed"])
      .optional(),
    search: z.string().optional(),
  }),
});

export const assignFollowUpSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ assignedFollowUp: z.string().min(1) }),
});

export const scheduleBaptismSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ baptismDate: z.string().min(1) }),
});

export const deleteConvertSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});


