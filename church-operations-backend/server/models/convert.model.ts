import mongoose, { Document, Schema } from "mongoose";

export type FollowUpStatus =
  | "Pending"
  | "In Progress"
  | "Contacted"
  | "Converted"
  | "Baptized"
  | "Closed";

export interface IConvert extends Document {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  dateOfSalvation?: Date;
  evangelist?: string; // User id
  assignedFollowUp?: string; // User id
  followUpStatus: FollowUpStatus;
  baptismDate?: Date;
  joinedCell?: string; // Cell id
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConvertSchema: Schema<IConvert> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String },
    dateOfSalvation: { type: Date },
    evangelist: { type: String },
    assignedFollowUp: { type: String },
    followUpStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Contacted", "Converted", "Baptized", "Closed"],
      default: "Pending",
    },
    baptismDate: { type: Date },
    joinedCell: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IConvert>("Convert", ConvertSchema);
