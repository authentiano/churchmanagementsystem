import mongoose, { Document, Schema } from "mongoose";

export type FollowUpStatus = "Pending" | "In Progress" | "Contacted" | "Completed" | "Closed";

export interface IFollowUpAttempt {
  by?: string;
  attemptedAt: Date;
  notes?: string;
  outcome?: string;
}

export interface IFollowUp extends Document {
  targetType: "Member" | "Convert";
  targetId: string;
  assignedTo?: string; // User id
  status: FollowUpStatus;
  attempts: IFollowUpAttempt[];
  nextAttemptAt?: Date;
  scheduledAt?: Date;
  priority?: "Low" | "Medium" | "High";
  createdBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FollowUpAttemptSchema = new Schema<IFollowUpAttempt>(
  {
    by: { type: String },
    attemptedAt: { type: Date, default: Date.now },
    notes: { type: String },
    outcome: { type: String },
  },
  { _id: false }
);

const FollowUpSchema: Schema<IFollowUp> = new Schema(
  {
    targetType: { type: String, enum: ["Member", "Convert"], required: true },
    targetId: { type: String, required: true, index: true },
    assignedTo: { type: String, index: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Contacted", "Completed", "Closed"],
      default: "Pending",
    },
    attempts: { type: [FollowUpAttemptSchema], default: [] },
    nextAttemptAt: { type: Date },
    scheduledAt: { type: Date },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    createdBy: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IFollowUp>("FollowUp", FollowUpSchema);
