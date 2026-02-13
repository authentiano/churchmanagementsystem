import { Router } from "express";
import * as DashboardController from "../controllers/dashboard.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Only SuperAdmin & Admin can view dashboard
router.get(
  "/",
  protect,
  authorize("SuperAdmin", "Admin"),
  DashboardController.getDashboard
);

export default router;
