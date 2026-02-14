import mongoose, { Document, Schema } from "mongoose";

export interface ISMSCredits extends Document {
  provider: string; // "twilio", "africas-talking", etc.
  creditsRemaining: number;
  creditsUsed: number;
  creditsTotal: number;
  lastTopUpAt?: Date;
  lastTopUpAmount?: number;
  costPerSMS: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SMSCreditsSchema: Schema<ISMSCredits> = new Schema(
  {
    provider: { type: String, required: true, unique: true, index: true },
    creditsRemaining: { type: Number, required: true, default: 0 },
    creditsUsed: { type: Number, required: true, default: 0 },
    creditsTotal: { type: Number, required: true, default: 0 },
    lastTopUpAt: { type: Date },
    lastTopUpAmount: { type: Number },
    costPerSMS: { type: Number, required: true, default: 0.01 },
    currency: { type: String, default: "USD" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISMSCredits>("SMSCredits", SMSCreditsSchema);
