import mongoose, { Schema, Document } from "mongoose";

export interface AttendanceRecord {
  date: Date;
  present: string[]; // Member IDs
  absent?: string[];
  notes?: string;
  createdAt?: Date;
}

export interface ICell extends Document {
  name: string;
  location?: string;
  leader: string; // User ID
  assistantLeader?: string; // User ID
  members: string[]; // Member IDs
  meetingDay: string;
  attendanceRecords?: AttendanceRecord[];
  parentCell?: string;
  childrenCells?: string[];
}

const AttendanceSchema = new Schema(
  {
    date: { type: Date, required: true },
    present: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    absent: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    notes: { type: String },
  },
  { _id: true, timestamps: { createdAt: true, updatedAt: false } }
);

const CellSchema: Schema<ICell> = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    leader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assistantLeader: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    meetingDay: { type: String },
    attendanceRecords: [AttendanceSchema],
    parentCell: { type: Schema.Types.ObjectId, ref: "Cell" },
    childrenCells: [{ type: Schema.Types.ObjectId, ref: "Cell" }],
  },
  { timestamps: true }
);

export const Cell = mongoose.model<ICell>("Cell", CellSchema);
