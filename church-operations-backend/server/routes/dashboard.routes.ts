import { Router } from "express";
import * as DashboardController from "../controllers/dashboard.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Only Super Admin & Admin can view dashboard
router.get(
  "/",
  protect,
  authorize("Super Admin", "Admin"),
  DashboardController.getDashboard
);

export default router;
