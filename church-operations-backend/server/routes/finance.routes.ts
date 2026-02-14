import { Router } from "express";
import * as FinanceController from "../controllers/finance.controller";
import { validate } from "../utils/validation";
import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import {
  createDonationSchema,
  updateDonationSchema,
  getDonationsSchema,
  getDonationSchema,
  verifyDonationSchema,
  deleteDonationSchema,
  getFinanceReportSchema,
} from "../types/finance.validation";

const router = Router();
router.use(protect);

// create donation - Finance Officer, Admin, Super Admin
router.post("/donations", authorizeRoles("Finance Officer", "Admin", "Super Admin"), validate(createDonationSchema), FinanceController.createDonation);

// list donations
router.get("/donations", authorizeRoles("Finance Officer", "Admin", "Super Admin"), validate(getDonationsSchema), FinanceController.getDonations);

// get by id
router.get("/donations/:id", authorizeRoles("Finance Officer", "Admin", "Super Admin"), validate(getDonationSchema), FinanceController.getDonationById);

// update donation
router.put("/donations/:id", authorizeRoles("Finance Officer", "Admin", "Super Admin"), validate(updateDonationSchema), FinanceController.updateDonation);

// verify donation
router.put("/donations/:id/verify", authorizeRoles("Finance Officer", "Admin", "Super Admin"), validate(verifyDonationSchema), FinanceController.verifyDonation);

// delete donation
router.delete("/donations/:id", authorizeRoles("Admin", "Super Admin"), validate(deleteDonationSchema), FinanceController.deleteDonation);

// get finance report
router.get("/reports/summary", authorizeRoles("Finance Officer", "Admin", "Super Admin"), validate(getFinanceReportSchema), FinanceController.getFinanceReport);

// get donation statistics
router.get("/stats", authorizeRoles("Finance Officer", "Admin", "Super Admin"), FinanceController.getDonationStats);

export default router;
