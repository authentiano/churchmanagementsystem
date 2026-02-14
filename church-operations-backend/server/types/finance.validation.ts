import { z } from "zod";

export const createDonationSchema = z.object({
  body: z.object({
    donorName: z.string().min(2),
    donorEmail: z.string().email().optional(),
    donorPhone: z.string().optional(),
    memberId: z.string().optional(),
    amount: z.number().positive(),
    currency: z.string().default("USD"),
    type: z.enum(["Tithe", "Offering", "Donation", "Building Fund", "Special Project"]),
    description: z.string().optional(),
    paymentMethod: z.enum(["Cash", "Bank Transfer", "Cheque", "Online"]),
    dateReceived: z.string().optional(),
    receiptNumber: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateDonationSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    donorName: z.string().min(2).optional(),
    donorEmail: z.string().email().optional(),
    donorPhone: z.string().optional(),
    amount: z.number().positive().optional(),
    currency: z.string().optional(),
    type: z.enum(["Tithe", "Offering", "Donation", "Building Fund", "Special Project"]).optional(),
    description: z.string().optional(),
    paymentMethod: z.enum(["Cash", "Bank Transfer", "Cheque", "Online"]).optional(),
    dateReceived: z.string().optional(),
    verificationStatus: z.enum(["Pending", "Verified", "Rejected"]).optional(),
    notes: z.string().optional(),
  }),
});

export const getDonationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    type: z.enum(["Tithe", "Offering", "Donation", "Building Fund", "Special Project"]).optional(),
    status: z.enum(["Pending", "Verified", "Rejected"]).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const getDonationSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const verifyDonationSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    verificationStatus: z.enum(["Verified", "Rejected"]),
    notes: z.string().optional(),
  }),
});

export const deleteDonationSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const getFinanceReportSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    groupBy: z.enum(["daily", "weekly", "monthly", "type"]).optional(),
  }),
});
