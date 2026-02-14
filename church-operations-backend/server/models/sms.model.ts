import mongoose, { Document, Schema } from "mongoose";

export interface ISMSLog extends Document {
  provider: "Twilio" | "AfriksTalking" | "Custom" | string;
  recipientPhone: string;
  recipientType: "Member" | "Cell" | "Convert" | "Custom";
  recipientId?: string; // Member ID, Cell ID, etc.
  message: string;
  messageLength: number;
  creditsCost: number;
  status: "Sent" | "Pending" | "Failed" | "Delivered";
  sentAt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  campaignId?: string;
  sentBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const SMSLogSchema: Schema<ISMSLog> = new Schema(
  {
    provider: { type: String, default: "Custom" },
    recipientPhone: { type: String, required: true },
    recipientType: { type: String, enum: ["Member", "Cell", "Convert", "Custom"], required: true },
    recipientId: { type: String },
    message: { type: String, required: true },
    messageLength: { type: Number },
    creditsCost: { type: Number, default: 1 },
    status: { type: String, enum: ["Sent", "Pending", "Failed", "Delivered"], default: "Pending" },
    sentAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date },
    errorMessage: { type: String },
    campaignId: { type: String },
    sentBy: { type: String },
  },
  { timestamps: true }
);

SMSLogSchema.index({ recipientPhone: 1 });
SMSLogSchema.index({ status: 1 });
SMSLogSchema.index({ campaignId: 1 });
SMSLogSchema.index({ sentAt: -1 });

export default mongoose.model<ISMSLog>("SMSLog", SMSLogSchema);
