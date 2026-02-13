//this file manages the user, the accounts created, like for the admin

console.log("Loading User model");


import mongoose, { Schema, Document } from "mongoose";

export type UserRole =
  | "Super Admin"
  | "Admin"
  | "Pastor"
  | "Finance Officer"
  | "Cell Leader"
  | "Follow-Up Team"
  | "Evangelism Team";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "Super Admin",
        "Admin",
        "Pastor",
        "Finance Officer",
        "Cell Leader",
        "Follow-Up Team",
        "Evangelism Team",
      ],
      default: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
