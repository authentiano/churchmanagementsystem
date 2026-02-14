import mongoose, { Document, Schema } from "mongoose";

export interface IEmailCampaign extends Document {
  name: string;
  subject: string;
  template: string; // HTML template with {{firstName}}, {{email}} etc.
  recipientType: "Members" | "Specific" | "Visitors" | "Converts";
  recipientIds?: string[]; // For "Specific"
  totalRecipients: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  failureCount: number;
  status: "Draft" | "Scheduled" | "Sent" | "InProgress";
  scheduledAt?: Date;
  sentAt?: Date;
  personalizationFields: string[]; // ["firstName", "email", "phone"]
  createdBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const EmailCampaignSchema: Schema<IEmailCampaign> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    template: { type: String, required: true },
    recipientType: { type: String, enum: ["Members", "Specific", "Visitors", "Converts"], required: true },
    recipientIds: { type: [String], default: [] },
    totalRecipients: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    bounceCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Scheduled", "Sent", "InProgress"], default: "Draft" },
    scheduledAt: { type: Date },
    sentAt: { type: Date },
    personalizationFields: { type: [String], default: [] },
    createdBy: { type: String },
  },
  { timestamps: true }
);

EmailCampaignSchema.index({ status: 1 });
EmailCampaignSchema.index({ createdAt: -1 });

export default mongoose.model<IEmailCampaign>("EmailCampaign", EmailCampaignSchema);
