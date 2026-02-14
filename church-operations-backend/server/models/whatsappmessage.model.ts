import mongoose, { Document, Schema } from "mongoose";

export interface IWhatsAppMessage extends Document {
  recipientPhone: string;
  recipientName?: string;
  memberId?: string;
  campaignId?: string;
  messageType: "text" | "template" | "media";
  templateName?: string;
  templateParams?: Record<string, string>;
  content: string;
  status: "Pending" | "Sent" | "Delivered" | "Read" | "Failed";
  provider: string;
  externalId?: string;
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppMessageSchema: Schema<IWhatsAppMessage> = new Schema(
  {
    recipientPhone: { type: String, required: true, index: true },
    recipientName: { type: String },
    memberId: { type: String },
    campaignId: { type: String, index: true },
    messageType: {
      type: String,
      enum: ["text", "template", "media"],
      default: "text",
    },
    templateName: { type: String },
    templateParams: { type: Schema.Types.Mixed },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Sent", "Delivered", "Read", "Failed"],
      default: "Pending",
    },
    provider: { type: String, required: true },
    externalId: { type: String },
    errorMessage: { type: String },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    readAt: { type: Date },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IWhatsAppMessage>("WhatsAppMessage", WhatsAppMessageSchema);
