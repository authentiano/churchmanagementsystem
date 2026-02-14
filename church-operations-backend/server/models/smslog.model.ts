import mongoose, { Document, Schema } from "mongoose";

export interface ISMSLog extends Document {
  recipientPhone: string;
  recipientName?: string;
  memberId?: string;
  campaignId?: string;
  message: string;
  status: "Pending" | "Sent" | "Failed" | "Bounced";
  provider: string; // "twilio" | "africas-talking" | etc.
  externalId?: string;
  errorMessage?: string;
  sentAt?: Date;
  createdBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const SMSLogSchema: Schema<ISMSLog> = new Schema(
  {
    recipientPhone: { type: String, required: true, index: true },
    recipientName: { type: String },
    memberId: { type: String },
    campaignId: { type: String, index: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Sent", "Failed", "Bounced"],
      default: "Pending",
    },
    provider: { type: String, required: true },
    externalId: { type: String },
    errorMessage: { type: String },
    sentAt: { type: Date },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISMSLog>("SMSLog", SMSLogSchema);
