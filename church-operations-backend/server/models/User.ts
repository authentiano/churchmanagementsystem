import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

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
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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

// Hash password **after validation but before save**
UserSchema.pre("save", async function () {
  // when using async middleware, Mongoose will use the returned promise
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
