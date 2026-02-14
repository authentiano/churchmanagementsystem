import { z } from "zod";

/* ===============================
   CREATE MEMBER
================================= */
export const createMemberSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    gender: z.enum(["Male", "Female", "Other"]),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    email: z.string().email("Invalid email format").optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    salvationStatus: z.boolean().optional(),
    baptismStatus: z.boolean().optional(),
    memberStatus: z
      .enum(["Visitor", "Convert", "Worker", "Leader"])
      .optional(),
    assignedCell: z.string().optional(),
    assignedFollowUpLeader: z.string().optional(),
    profilePhoto: z.string().optional(),
  }),
});

/* ===============================
   UPDATE MEMBER
================================= */
export const updateMemberSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Member ID is required"),
  }),
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    salvationStatus: z.boolean().optional(),
    baptismStatus: z.boolean().optional(),
    memberStatus: z
      .enum(["Visitor", "Convert", "Worker", "Leader"])
      .optional(),
    assignedCell: z.string().optional(),
    assignedFollowUpLeader: z.string().optional(),
    profilePhoto: z.string().optional(),
  }),
});

/* ===============================
   GET MEMBERS (pagination + filters)
================================= */
export const getMembersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    memberStatus: z.enum(["Visitor", "Convert", "Worker", "Leader"]).optional(),
    search: z.string().optional(),
  }),
});

/* ===============================
   DELETE MEMBER
================================= */
export const deleteMemberSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Member ID is required"),
  }),
});
