import mongoose, { Schema, Document } from "mongoose";

export interface ICell extends Document {
  name: string;
  leader: string; // User ID
  members: string[]; // Member IDs
  meetingDay: string;
}

const CellSchema: Schema<ICell> = new Schema(
  {
    name: { type: String, required: true },
    leader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    meetingDay: { type: String, required: true },
  },
  { timestamps: true }
);

export const Cell = mongoose.model<ICell>("Cell", CellSchema);
