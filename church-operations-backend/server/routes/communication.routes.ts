import { Router } from "express";
import * as CommunicationController from "../controllers/communication.controller";
import { validate } from "../utils/validation";
import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import {
  sendBulkSMSSchema,
  sendSingleSMSSchema,
  getSMSLogsSchema,
  refillSMSCreditSchema,
  createEmailCampaignSchema,
  updateEmailCampaignSchema,
  sendEmailCampaignSchema,
  getEmailCampaignsSchema,
  sendWhatsAppMessageSchema,
  sendWhatsAppBulkSchema,
  getWhatsAppMessagesSchema,
  deleteEmailCampaignSchema,
} from "../types/communication.validation";

const router = Router();
router.use(protect);

// ============ SMS ROUTES ============

// Send bulk SMS - Admin, Evangelism Team, Follow-Up Team
router.post("/sms/bulk", authorizeRoles("Admin", "Super Admin", "Evangelism Team", "Follow-Up Team"), validate(sendBulkSMSSchema), CommunicationController.sendBulkSMS);

// Send single SMS
router.post("/sms/single", authorizeRoles("Admin", "Super Admin", "Evangelism Team"), validate(sendSingleSMSSchema), CommunicationController.sendSingleSMS);

// Get SMS logs
router.get("/sms/logs", authorizeRoles("Admin", "Super Admin"), validate(getSMSLogsSchema), CommunicationController.getSMSLogs);

// SMS stats
router.get("/sms/stats", authorizeRoles("Admin", "Super Admin"), CommunicationController.getSMSStats);

// Get SMS credit
router.get("/sms/credit", authorizeRoles("Admin", "Super Admin", "Finance Officer"), CommunicationController.getSMSCredit);

// Refill SMS credit
router.post("/sms/credit/refill", authorizeRoles("Admin", "Super Admin", "Finance Officer"), validate(refillSMSCreditSchema), CommunicationController.refillSMSCredit);

// ============ EMAIL CAMPAIGN ROUTES ============

// Create email campaign
router.post("/email/campaigns", authorizeRoles("Admin", "Super Admin"), validate(createEmailCampaignSchema), CommunicationController.createEmailCampaign);

// Get email campaigns
router.get("/email/campaigns", authorizeRoles("Admin", "Super Admin"), validate(getEmailCampaignsSchema), CommunicationController.getEmailCampaigns);

// Get email campaign by id
router.get("/email/campaigns/:id", authorizeRoles("Admin", "Super Admin"), CommunicationController.getEmailCampaignById);

// Update email campaign
router.put("/email/campaigns/:id", authorizeRoles("Admin", "Super Admin"), validate(updateEmailCampaignSchema), CommunicationController.updateEmailCampaign);

// Send email campaign
router.post("/email/campaigns/:id/send", authorizeRoles("Admin", "Super Admin"), validate(sendEmailCampaignSchema), CommunicationController.sendEmailCampaign);

// Delete email campaign
router.delete("/email/campaigns/:id", authorizeRoles("Admin", "Super Admin"), validate(deleteEmailCampaignSchema), CommunicationController.deleteEmailCampaign);

// ============ WHATSAPP ROUTES ============

// Send single WhatsApp message
router.post("/whatsapp/message", authorizeRoles("Admin", "Super Admin", "Evangelism Team", "Follow-Up Team"), validate(sendWhatsAppMessageSchema), CommunicationController.sendWhatsAppMessage);

// Send bulk WhatsApp messages
router.post("/whatsapp/bulk", authorizeRoles("Admin", "Super Admin", "Evangelism Team", "Follow-Up Team"), validate(sendWhatsAppBulkSchema), CommunicationController.sendWhatsAppBulk);

// Get WhatsApp messages
router.get("/whatsapp/messages", authorizeRoles("Admin", "Super Admin"), validate(getWhatsAppMessagesSchema), CommunicationController.getWhatsAppMessages);

// WhatsApp stats
router.get("/whatsapp/stats", authorizeRoles("Admin", "Super Admin"), CommunicationController.getWhatsAppStats);

export default router;
