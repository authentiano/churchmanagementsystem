import SMSLog from "../models/sms.model";
import SMSCredit from "../models/smscredit.model";
import EmailCampaign from "../models/emailcampaign.model";
import WhatsAppMessage from "../models/whatsapp.model";
import Member from "../models/member.model";
import { Cell } from "../models/cell.model";
import Convert from "../models/convert.model";
import SMSProvider from "../utils/smsProvider";
import EmailProvider from "../utils/emailProvider";
import WhatsAppProvider from "../utils/whatsappProvider";

// Initialize providers (in production, these would use real API keys from .env)
const smsProvider = new SMSProvider({ provider: "Custom" });
const emailProvider = new EmailProvider({ provider: "Custom", fromEmail: "noreply@churchms.com" });
const whatsappProvider = new WhatsAppProvider({ provider: "Custom" });

// ============ SMS SERVICE ============

export const sendBulkSMS = async (message: string, recipientType: string, cellId?: string, sentBy?: string) => {
  let phones: string[] = [];

  if (recipientType === "Members") {
    const members = await Member.find({ phone: { $exists: true } }).select("phone");
    phones = members.map((m) => m.phone);
  } else if (recipientType === "Cell" && cellId) {
    const cell = await Cell.findById(cellId).populate("members", "phone");
    if (cell && Array.isArray((cell as any).members)) {
      phones = (cell as any).members.map((m: any) => m.phone || m);
    }
  } else if (recipientType === "Visitors") {
    const members = await Member.find({ memberStatus: "Visitor", phone: { $exists: true } }).select("phone");
    phones = members.map((m) => m.phone);
  } else if (recipientType === "Converts") {
    const converts = await Convert.find({ phone: { $exists: true } }).select("phone");
    phones = converts.map((c) => c.phone);
  }

  const logs: any[] = [];
  for (const phone of phones) {
    const result = await smsProvider.sendSMS(phone, message);
    const log = await SMSLog.create({
      provider: "Custom",
      recipientPhone: phone,
      recipientType,
      message,
      messageLength: message.length,
      status: result.success ? "Sent" : "Failed",
      errorMessage: result.error,
      sentBy,
    });
    logs.push(log);
  }

  return { sentCount: logs.length, logs };
};

export const sendSingleSMS = async (recipientPhone: string, message: string, sentBy?: string) => {
  const result = await smsProvider.sendSMS(recipientPhone, message);
  const log = await SMSLog.create({
    provider: "Custom",
    recipientPhone,
    recipientType: "Custom",
    message,
    messageLength: message.length,
    status: result.success ? "Sent" : "Failed",
    errorMessage: result.error,
    sentBy,
  });

  return log;
};

export const getSMSLogs = async (opts?: { page?: number; limit?: number; status?: string; recipientType?: string; campaignId?: string }) => {
  if (!opts) return SMSLog.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.status) filter.status = opts.status;
  if (opts.recipientType) filter.recipientType = opts.recipientType;
  if (opts.campaignId) filter.campaignId = opts.campaignId;

  const [docs, total] = await Promise.all([
    SMSLog.find(filter).skip(skip).limit(limit).sort({ sentAt: -1 }),
    SMSLog.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { docs, total, totalPages };
};

export const getSMSStats = async () => {
  const stats = await SMSLog.aggregate([
    {
      $facet: {
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        byType: [{ $group: { _id: "$recipientType", count: { $sum: 1 } } }],
        total: [{ $group: { _id: null, totalCount: { $sum: 1 } } }],
      },
    },
  ]);

  return stats[0];
};

export const getSMSCredit = async (accountId?: string) => {
  const id = accountId || "default";
  const credit = await SMSCredit.findOne({ accountId: id });
  if (!credit) {
    return { accountId: id, availableCredits: 0, totalCredits: 0, usedCredits: 0 };
  }
  return credit;
};

export const refillSMSCredit = async (amount: number, accountId?: string) => {
  const id = accountId || "default";
  let credit = await SMSCredit.findOne({ accountId: id });

  if (!credit) {
    credit = await SMSCredit.create({
      accountId: id,
      totalCredits: amount,
      availableCredits: amount,
      usedCredits: 0,
      lastRefillDate: new Date(),
      lastRefillAmount: amount,
    });
  } else {
    credit.totalCredits += amount;
    credit.availableCredits += amount;
    credit.lastRefillDate = new Date();
    credit.lastRefillAmount = amount;
    await credit.save();
  }

  return credit;
};

// ============ EMAIL CAMPAIGN SERVICE ============

export const createEmailCampaign = async (input: any, createdBy?: string) => {
  const campaign = await EmailCampaign.create({
    name: input.name,
    subject: input.subject,
    template: input.template,
    recipientType: input.recipientType,
    recipientIds: input.recipientIds,
    personalizationFields: input.personalizationFields || [],
    createdBy,
    status: "Draft",
  });

  return campaign;
};

export const getEmailCampaigns = async (opts?: { page?: number; limit?: number; status?: string }) => {
  if (!opts) return EmailCampaign.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.status) filter.status = opts.status;

  const [docs, total] = await Promise.all([
    EmailCampaign.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    EmailCampaign.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { docs, total, totalPages };
};

export const getEmailCampaignById = async (id: string) => {
  const campaign = await EmailCampaign.findById(id);
  if (!campaign) {
    const err: any = new Error("Email campaign not found");
    err.statusCode = 404;
    throw err;
  }
  return campaign;
};

export const updateEmailCampaign = async (id: string, update: any) => {
  if (update.scheduledAt && typeof update.scheduledAt === "string") {
    (update as any).scheduledAt = new Date(update.scheduledAt);
  }

  const campaign = await EmailCampaign.findByIdAndUpdate(id, update, { new: true });
  if (!campaign) {
    const err: any = new Error("Email campaign not found");
    err.statusCode = 404;
    throw err;
  }
  return campaign;
};

export const deleteEmailCampaign = async (id: string) => {
  const campaign = await EmailCampaign.findByIdAndDelete(id);
  if (!campaign) {
    const err: any = new Error("Email campaign not found");
    err.statusCode = 404;
    throw err;
  }
  return campaign;
};

export const sendEmailCampaign = async (campaignId: string) => {
  const campaign = await EmailCampaign.findById(campaignId);
  if (!campaign) {
    const err: any = new Error("Email campaign not found");
    err.statusCode = 404;
    throw err;
  }

  // Get recipients
  let recipients: any[] = [];
  if (campaign.recipientType === "Members") {
    recipients = await Member.find({ email: { $exists: true, $ne: "" } });
  } else if (campaign.recipientType === "Visitors") {
    recipients = await Member.find({ memberStatus: "Visitor", email: { $exists: true, $ne: "" } });
  } else if (campaign.recipientType === "Converts") {
    recipients = await Convert.find({ email: { $exists: true, $ne: "" } });
  } else if (campaign.recipientType === "Specific" && campaign.recipientIds?.length > 0) {
    recipients = await Member.find({ _id: { $in: campaign.recipientIds } });
  }

  // Send emails
  let sentCount = 0;
  for (const recipient of recipients) {
    let htmlContent = campaign.template;
    // Replace personalization fields
    if (recipient.firstName) htmlContent = htmlContent.replace(/{{firstName}}/g, recipient.firstName);
    if (recipient.email) htmlContent = htmlContent.replace(/{{email}}/g, recipient.email);
    if (recipient.phone) htmlContent = htmlContent.replace(/{{phone}}/g, recipient.phone);

    const result = await emailProvider.sendEmail(recipient.email, campaign.subject, htmlContent);
    if (result.success) sentCount++;
  }

  campaign.status = "Sent";
  campaign.sentAt = new Date();
  campaign.totalRecipients = recipients.length;
  campaign.sentCount = sentCount;
  await campaign.save();

  return campaign;
};

// ============ WHATSAPP SERVICE ============

export const sendWhatsAppMessage = async (recipientPhone: string, messageBody: string, messageType?: string, sentBy?: string) => {
  const result = await whatsappProvider.sendMessage(recipientPhone, messageBody);

  const message = await WhatsAppMessage.create({
    provider: "Custom",
    recipientPhone,
    messageType: messageType || "Text",
    messageBody,
    status: result.success ? "Sent" : "Failed",
    errorMessage: result.error,
    sentBy,
  });

  return message;
};

export const sendWhatsAppBulk = async (message: string, recipientType: string, cellId?: string, sentBy?: string) => {
  let phones: string[] = [];

  if (recipientType === "Members") {
    const members = await Member.find({ phone: { $exists: true } }).select("phone");
    phones = members.map((m) => m.phone);
  } else if (recipientType === "Cell" && cellId) {
    const cell = await Cell.findById(cellId).populate("members", "phone");
    if (cell && Array.isArray((cell as any).members)) {
      phones = (cell as any).members.map((m: any) => m.phone || m);
    }
  } else if (recipientType === "Visitors") {
    const members = await Member.find({ memberStatus: "Visitor", phone: { $exists: true } }).select("phone");
    phones = members.map((m) => m.phone);
  } else if (recipientType === "Converts") {
    const converts = await Convert.find({ phone: { $exists: true } }).select("phone");
    phones = converts.map((c) => c.phone);
  }

  const result = await whatsappProvider.sendBroadcast(phones, message);

  const logs: any[] = [];
  for (const phone of phones) {
    const log = await WhatsAppMessage.create({
      provider: "Custom",
      recipientPhone: phone,
      recipientType,
      messageBody: message,
      messageType: "Text",
      status: "Sent",
      sentBy,
    });
    logs.push(log);
  }

  return { sentCount: result.sent, failedCount: result.failed, logs };
};

export const getWhatsAppMessages = async (opts?: { page?: number; limit?: number; status?: string; campaignId?: string }) => {
  if (!opts) return WhatsAppMessage.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.status) filter.status = opts.status;
  if (opts.campaignId) filter.campaignId = opts.campaignId;

  const [docs, total] = await Promise.all([
    WhatsAppMessage.find(filter).skip(skip).limit(limit).sort({ sentAt: -1 }),
    WhatsAppMessage.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { docs, total, totalPages };
};

export const getWhatsAppStats = async () => {
  const stats = await WhatsAppMessage.aggregate([
    {
      $facet: {
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        total: [{ $group: { _id: null, totalCount: { $sum: 1 } } }],
      },
    },
  ]);

  return stats[0];
};
