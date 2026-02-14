import { Router } from "express";
import * as FollowUpController from "../controllers/followup.controller";
import { validate } from "../utils/validation";
import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import {
  createFollowUpSchema,
  getFollowUpsSchema,
  getFollowUpSchema,
  recordAttemptSchema,
  updateFollowUpSchema,
  deleteFollowUpSchema,
} from "../types/followup.validation";

const router = Router();
router.use(protect);

// create follow-up (Evangelism Team, Admins, Follow-Up Team can create)
router.post("/", authorizeRoles("Evangelism Team", "Follow-Up Team", "Admin", "Super Admin"), validate(createFollowUpSchema), FollowUpController.createFollowUp);

// list / search follow-ups
router.get("/", authorizeRoles("Follow-Up Team", "Admin", "Super Admin"), validate(getFollowUpsSchema), FollowUpController.getFollowUps);

// get pending queue for logged-in follow-up user
router.get("/pending", authorizeRoles("Follow-Up Team"), FollowUpController.getPending);

// get by id
router.get("/:id", authorizeRoles("Follow-Up Team", "Admin", "Super Admin"), validate(getFollowUpSchema), FollowUpController.getFollowUpById);

// update
router.put("/:id", authorizeRoles("Follow-Up Team", "Admin", "Super Admin"), validate(updateFollowUpSchema), FollowUpController.updateFollowUp);

// delete
router.delete("/:id", authorizeRoles("Admin", "Super Admin"), validate(deleteFollowUpSchema), FollowUpController.deleteFollowUp);

// record attempt
router.post("/:id/attempt", authorizeRoles("Follow-Up Team", "Admin", "Super Admin"), validate(recordAttemptSchema), FollowUpController.recordAttempt);

// trigger reminders (admin) - development helper for running due reminders
router.post("/trigger/reminders", authorizeRoles("Admin", "Super Admin"), FollowUpController.triggerReminders);

export default router;
