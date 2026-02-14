import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as CommunicationService from "../services/communication.service";

// ============ SMS ENDPOINTS ============

export const sendBulkSMS = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { message, recipientType, cellId } = req.body;

  const result = await CommunicationService.sendBulkSMS(message, recipientType, cellId, user?._id);
  res.status(200).json({ status: "success", data: { sentCount: result.sentCount, logs: result.logs } });
});

export const sendSingleSMS = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { recipientPhone, message } = req.body;

  const log = await CommunicationService.sendSingleSMS(recipientPhone, message, user?._id);
  res.status(201).json({ status: "success", data: log });
});

export const getSMSLogs = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const { docs, total, totalPages } = await CommunicationService.getSMSLogs({
    page: q.page ? Number(q.page) : 1,
    limit: q.limit ? Number(q.limit) : 10,
    status: q.status,
    recipientType: q.recipientType,
    campaignId: q.campaignId,
  });

  res.status(200).json({
    status: "success",
    data: { logs: docs, meta: { total, page: q.page || 1, limit: q.limit || 10, totalPages } },
  });
});

export const getSMSStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await CommunicationService.getSMSStats();
  res.status(200).json({ status: "success", data: stats });
});

export const getSMSCredit = asyncHandler(async (req: Request, res: Response) => {
  const credit = await CommunicationService.getSMSCredit();
  res.status(200).json({ status: "success", data: credit });
});

export const refillSMSCredit = asyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const credit = await CommunicationService.refillSMSCredit(amount);
  res.status(200).json({ status: "success", data: credit });
});

// ============ EMAIL CAMPAIGN ENDPOINTS ============

export const createEmailCampaign = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const campaign = await CommunicationService.createEmailCampaign(req.body, user?._id);
  res.status(201).json({ status: "success", data: campaign });
});

export const getEmailCampaigns = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const { docs, total, totalPages } = await CommunicationService.getEmailCampaigns({
    page: q.page ? Number(q.page) : 1,
    limit: q.limit ? Number(q.limit) : 10,
    status: q.status,
  });

  res.status(200).json({
    status: "success",
    data: { campaigns: docs, meta: { total, page: q.page || 1, limit: q.limit || 10, totalPages } },
  });
});

export const getEmailCampaignById = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await CommunicationService.getEmailCampaignById(req.params.id);
  res.status(200).json({ status: "success", data: campaign });
});

export const updateEmailCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await CommunicationService.updateEmailCampaign(req.params.id, req.body);
  res.status(200).json({ status: "success", data: campaign });
});

export const sendEmailCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await CommunicationService.sendEmailCampaign(req.params.id);
  res.status(200).json({ status: "success", data: campaign });
});

export const deleteEmailCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await CommunicationService.deleteEmailCampaign(req.params.id);
  res.status(200).json({ status: "success", data: campaign });
});

// ============ WHATSAPP ENDPOINTS ============

export const sendWhatsAppMessage = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { recipientPhone, messageBody, messageType } = req.body;

  const message = await CommunicationService.sendWhatsAppMessage(recipientPhone, messageBody, messageType, user?._id);
  res.status(201).json({ status: "success", data: message });
});

export const sendWhatsAppBulk = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { message, recipientType, cellId } = req.body;

  const result = await CommunicationService.sendWhatsAppBulk(message, recipientType, cellId, user?._id);
  res.status(200).json({ status: "success", data: { sentCount: result.sentCount, failedCount: result.failedCount, logs: result.logs } });
});

export const getWhatsAppMessages = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const { docs, total, totalPages } = await CommunicationService.getWhatsAppMessages({
    page: q.page ? Number(q.page) : 1,
    limit: q.limit ? Number(q.limit) : 10,
    status: q.status,
    campaignId: q.campaignId,
  });

  res.status(200).json({
    status: "success",
    data: { messages: docs, meta: { total, page: q.page || 1, limit: q.limit || 10, totalPages } },
  });
});

export const getWhatsAppStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await CommunicationService.getWhatsAppStats();
  res.status(200).json({ status: "success", data: stats });
});
