import mongoose, { Document, Schema } from "mongoose";

export interface IWhatsAppMessage extends Document {
  provider: "WhatsAppBusiness" | "Custom" | string;
  recipientPhone: string;
  recipientName?: string;
  recipientType: "Member" | "Cell" | "Convert" | "Custom";
  recipientId?: string;
  messageType: "Text" | "Template" | "MediaGroup" | "Interactive";
  templateName?: string;
  messageBody: string;
  mediaUrl?: string;
  status: "Sent" | "Pending" | "Failed" | "Delivered" | "Read";
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  campaignId?: string;
  sentBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppMessageSchema: Schema<IWhatsAppMessage> = new Schema(
  {
    provider: { type: String, default: "Custom" },
    recipientPhone: { type: String, required: true },
    recipientName: { type: String },
    recipientType: { type: String, enum: ["Member", "Cell", "Convert", "Custom"], required: true },
    recipientId: { type: String },
    messageType: { type: String, enum: ["Text", "Template", "MediaGroup", "Interactive"], default: "Text" },
    templateName: { type: String },
    messageBody: { type: String, required: true },
    mediaUrl: { type: String },
    status: { type: String, enum: ["Sent", "Pending", "Failed", "Delivered", "Read"], default: "Pending" },
    sentAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date },
    readAt: { type: Date },
    errorMessage: { type: String },
    campaignId: { type: String },
    sentBy: { type: String },
  },
  { timestamps: true }
);

WhatsAppMessageSchema.index({ recipientPhone: 1 });
WhatsAppMessageSchema.index({ status: 1 });
WhatsAppMessageSchema.index({ campaignId: 1 });
WhatsAppMessageSchema.index({ sentAt: -1 });

export default mongoose.model<IWhatsAppMessage>("WhatsAppMessage", WhatsAppMessageSchema);
