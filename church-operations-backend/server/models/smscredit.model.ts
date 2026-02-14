import mongoose, { Document, Schema } from "mongoose";

export interface ISMSCredit extends Document {
  accountId: string; // Church/Organization ID or User ID
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  provider: "Twilio" | "AfriksTalking" | "Custom" | string;
  costPerSMS: number; // Cost per SMS unit
  lastRefillDate?: Date;
  lastRefillAmount?: number;
  lowBalanceAlert: boolean;
  alertThreshold: number; // Alert when credits fall below this
  createdAt: Date;
  updatedAt: Date;
}

const SMSCreditSchema: Schema<ISMSCredit> = new Schema(
  {
    accountId: { type: String, required: true, unique: true },
    totalCredits: { type: Number, default: 0 },
    usedCredits: { type: Number, default: 0 },
    availableCredits: { type: Number, default: 0 },
    provider: { type: String, default: "Custom" },
    costPerSMS: { type: Number, default: 1 },
    lastRefillDate: { type: Date },
    lastRefillAmount: { type: Number },
    lowBalanceAlert: { type: Boolean, default: true },
    alertThreshold: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export default mongoose.model<ISMSCredit>("SMSCredit", SMSCreditSchema);
