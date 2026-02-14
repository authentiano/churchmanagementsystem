import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Protect middleware - verifies JWT and attaches `req.user`
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = (req.headers.authorization || "") as string;
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

    if (!token) {
      return res.status(401).json({ status: "error", message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (!decoded?.id) {
      return res.status(401).json({ status: "error", message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ status: "error", message: "User not found" });
    }

    // attach user to request (use any to avoid TS type augmentation here)
    (req as any).user = user;
    next();
  } catch (err: any) {
    console.error("protect middleware error", err);
    return res.status(401).json({ status: "error", message: "Not authorized" });
  }
};

// Authorize middleware - checks roles safely
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ status: "error", message: "Not authenticated" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ status: "error", message: "Forbidden: Insufficient role" });
    }

    next();
  };
};
