import { z } from "zod";

// SMS Schemas
export const sendBulkSMSSchema = z.object({
  body: z.object({
    message: z.string().min(1).max(160),
    recipientType: z.enum(["Members", "Cell", "Visitors", "Converts"]),
    cellId: z.string().optional(), // For "Cell" type
    provider: z.string().optional(),
  }),
});

export const sendSingleSMSSchema = z.object({
  body: z.object({
    recipientPhone: z.string().min(10),
    message: z.string().min(1).max(160),
    provider: z.string().optional(),
  }),
});

export const getSMSLogsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    status: z.enum(["Sent", "Pending", "Failed", "Delivered"]).optional(),
    recipientType: z.enum(["Member", "Cell", "Convert", "Custom"]).optional(),
    campaignId: z.string().optional(),
  }),
});

export const getSMSCreditSchema = z.object({
  query: z.object({
    accountId: z.string().optional(),
  }),
});

export const refillSMSCreditSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    accountId: z.string().optional(),
  }),
});

// Email Campaign Schemas
export const createEmailCampaignSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    subject: z.string().min(5),
    template: z.string().min(10),
    recipientType: z.enum(["Members", "Specific", "Visitors", "Converts"]),
    recipientIds: z.array(z.string()).optional(),
    personalizationFields: z.array(z.string()).optional(),
  }),
});

export const updateEmailCampaignSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(2).optional(),
    subject: z.string().min(5).optional(),
    template: z.string().min(10).optional(),
    status: z.enum(["Draft", "Scheduled", "Sent", "InProgress"]).optional(),
    scheduledAt: z.string().optional(),
  }),
});

export const sendEmailCampaignSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const getEmailCampaignsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    status: z.enum(["Draft", "Scheduled", "Sent", "InProgress"]).optional(),
  }),
});

// WhatsApp Schemas
export const sendWhatsAppMessageSchema = z.object({
  body: z.object({
    recipientPhone: z.string().min(10),
    messageBody: z.string().min(1),
    messageType: z.enum(["Text", "Template", "MediaGroup", "Interactive"]).optional(),
    templateName: z.string().optional(),
    mediaUrl: z.string().optional(),
    provider: z.string().optional(),
  }),
});

export const sendWhatsAppBulkSchema = z.object({
  body: z.object({
    message: z.string().min(1),
    recipientType: z.enum(["Members", "Cell", "Converts", "Visitors"]),
    cellId: z.string().optional(),
    messageType: z.enum(["Text", "Template"]).optional(),
  }),
});

export const getWhatsAppMessagesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    status: z.enum(["Sent", "Pending", "Failed", "Delivered", "Read"]).optional(),
    campaignId: z.string().optional(),
  }),
});

export const deleteEmailCampaignSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
