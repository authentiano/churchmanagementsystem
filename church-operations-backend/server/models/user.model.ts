import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role:
    | "SuperAdmin"
    | "Admin"
    | "Pastor"
    | "FinanceOfficer"
    | "CellLeader"
    | "FollowUpTeam"
    | "EvangelismTeam";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "SuperAdmin",
        "Admin",
        "Pastor",
        "FinanceOfficer",
        "CellLeader",
        "FollowUpTeam",
        "EvangelismTeam",
      ],
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
