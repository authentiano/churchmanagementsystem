import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  member: string; // Member ID
  amount: number;
  category: "Tithe" | "Offering" | "Partnership" | "SpecialSeed";
  createdAt: Date;
}

const DonationSchema: Schema<IDonation> = new Schema(
  {
    member: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Tithe", "Offering", "Partnership", "SpecialSeed"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model<IDonation>(
  "Donation",
  DonationSchema
);
