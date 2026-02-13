//debug line
console.log("Loading app.ts");

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/member.routes";




// Load env variables
dotenv.config();

const app = express();

// Body parser
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


//memberRoutes
app.use("/api/v1/members", memberRoutes);

//authenticated user routes
app.use("/api/v1/auth", authRoutes);


// 🛡️ Security middlewares
app.use(helmet()); // Secure headers
app.use(cors());   // Allow cross-origin requests

// 📦 Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 HTTP request logger (only in dev)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ⏱️ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, try again later",
});
app.use(limiter);

// ✅ Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// ⚠️ Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;
