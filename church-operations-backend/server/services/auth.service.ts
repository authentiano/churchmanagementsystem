console.log("Loading auth.service.ts");

import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (input: RegisterInput) => {
  console.log("👉 registerUser called");

  const { name, email, password, role } = input;

  console.log("👉 Checking existing user");
  const existingUser = await User.findOne({ email });
  console.log("👉 Existing user check done");

  if (existingUser) {
    throw new Error("User already exists");
  }

  console.log("👉 Creating user");
  const user = await User.create({
    name,
    email,
    password, // hashed by model pre-save hook
    role: role || "Admin",
  });

  console.log("👉 User created");
  return user;
};

export const loginUser = async (input: LoginInput) => {
  console.log("👉 loginUser called");

  const { email, password } = input;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  console.log("👉 Creating JWT tokens");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  console.log("👉 Tokens created");

  return { user, token, refreshToken };
};
