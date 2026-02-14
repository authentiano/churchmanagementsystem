import mongoose, { Schema, Document } from "mongoose";

export type DonationType = "Tithe" | "Offering" | "Donation" | "Building Fund" | "Special Project";

export interface IDonation extends Document {
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  memberId?: string; // Optional: link to Member ID
  amount: number;
  currency: string; // "USD", "NGN", etc.
  type: DonationType;
  category?: "Tithe" | "Offering" | "Partnership" | "SpecialSeed"; // Legacy support
  description?: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Cheque" | "Online";
  dateReceived: Date;
  recordedBy?: string; // User id
  verificationStatus: "Pending" | "Verified" | "Rejected";
  receiptNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema<IDonation> = new Schema(
  {
    donorName: { type: String, required: true, trim: true },
    donorEmail: { type: String, trim: true, lowercase: true },
    donorPhone: { type: String, trim: true },
    memberId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    type: {
      type: String,
      enum: ["Tithe", "Offering", "Donation", "Building Fund", "Special Project"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Tithe", "Offering", "Partnership", "SpecialSeed"],
    },
    description: { type: String },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Cheque", "Online"],
      required: true,
    },
    dateReceived: { type: Date, default: Date.now },
    recordedBy: { type: String },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    receiptNumber: { type: String, unique: true, sparse: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// Create index for efficient queries
DonationSchema.index({ dateReceived: -1 });
DonationSchema.index({ type: 1 });
DonationSchema.index({ verificationStatus: 1 });

export const Donation = mongoose.model<IDonation>(
  "Donation",
  DonationSchema
);
