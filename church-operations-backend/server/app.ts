console.log("Loading app.ts");

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/member.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();

// 🛡️ Security middlewares
app.use(helmet());
app.use(cors());

// 📦 Body parsers (ONLY ONCE)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 Logger (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ⏱️ Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ✅ Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// ⚠️ Global error handler (MUST BE LAST)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error:", err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;
