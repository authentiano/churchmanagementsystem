import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/member.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import cellRoutes from "./routes/cell.routes";
import evangelismRoutes from "./routes/evangelism.routes";
import followupRoutes from "./routes/followup.routes";
import financeRoutes from "./routes/finance.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());
app.use(cors());

// Logger
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/cells", cellRoutes);
app.use("/api/v1/evangelism", evangelismRoutes);
app.use("/api/v1/followups", followupRoutes);
app.use("/api/v1/finance", financeRoutes);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Global error handler
app.use(errorHandler);

export default app;
