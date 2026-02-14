import { z } from "zod";

export const createCellSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Cell name is required"),
    leader: z.string().optional(),
    meetingDay: z.string().optional(),
  }),
});

export const updateCellSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  body: z.object({
    name: z.string().min(2).optional(),
    leader: z.string().optional(),
    meetingDay: z.string().optional(),
    members: z.array(z.string()).optional(),
  }),
});

export const assignLeaderSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  body: z.object({ leaderId: z.string().min(1, "Leader ID is required") }),
});

export const addMembersSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  body: z.object({ memberIds: z.array(z.string().min(1)).min(1) }),
});

export const getCellsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
  }),
});

/* ===============================
   ATTENDANCE
================================= */
export const createAttendanceSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  body: z.object({
    date: z.string().optional(),
    present: z.array(z.string().min(1)).min(0),
    absent: z.array(z.string().min(1)).optional(),
    notes: z.string().optional(),
  }),
});

export const getAttendanceSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  }),
});

export const getMetricsSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  query: z.object({
    weeks: z.coerce.number().int().positive().optional(),
  }).optional(),
});

export const multiplyCellSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  body: z.object({
    name: z.string().min(2, "New cell name required"),
    leader: z.string().optional(),
    memberIds: z.array(z.string().min(1)).optional(),
  }),
});

export const getCellReportSchema = z.object({
  params: z.object({ id: z.string().min(1, "Cell ID is required") }),
  query: z.object({ from: z.string().optional(), to: z.string().optional() }).optional(),
});