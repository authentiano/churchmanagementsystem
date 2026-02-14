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

// Analytics endpoints (for detailed insights)
router.get("/analytics/evangelism", protect, authorize("Super Admin", "Admin", "Evangelism Team"), DashboardController.getEvangelismAnalytics);
router.get("/analytics/followup", protect, authorize("Super Admin", "Admin", "Follow-Up Team"), DashboardController.getFollowUpAnalytics);
router.get("/analytics/cells", protect, authorize("Super Admin", "Admin", "Cell Leader"), DashboardController.getCellAnalytics);
router.get("/analytics/finance", protect, authorize("Super Admin", "Admin", "Finance Officer"), DashboardController.getFinanceAnalytics);
router.get("/analytics/communication", protect, authorize("Super Admin", "Admin"), DashboardController.getCommunicationAnalytics);

export default router;
