//this manages the members details. 

import mongoose, { Schema, Document } from "mongoose";

export type MemberStatus = "Visitor" | "Convert" | "Worker" | "Leader";

export interface IMember extends Document {
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  address?: string;
  dateOfBirth?: Date;
  salvationStatus: boolean;
  baptismStatus: boolean;
  memberStatus: MemberStatus;
  assignedCell?: string;
  assignedFollowUpLeader?: string;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema<IMember> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    address: { type: String },
    dateOfBirth: { type: Date },
    salvationStatus: { type: Boolean, default: false },
    baptismStatus: { type: Boolean, default: false },
    memberStatus: {
      type: String,
      enum: ["Visitor", "Convert", "Worker", "Leader"],
      default: "Visitor",
    },
    assignedCell: { type: String },
    assignedFollowUpLeader: { type: String },
    profilePhoto: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IMember>("Member", MemberSchema);
