import { z } from "zod";

/* ===============================
   REGISTER
================================= */
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    role: z.enum(["Admin", "Super Admin"]).optional(),
  }),
});

/* ===============================
   LOGIN
================================= */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});
