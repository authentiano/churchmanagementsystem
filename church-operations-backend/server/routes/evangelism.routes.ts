import { Router } from "express";
import * as EvangelismController from "../controllers/evangelism.controller";
import { validate } from "../utils/validation";
import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import {
  createConvertSchema,
  updateConvertSchema,
  getConvertsSchema,
  assignFollowUpSchema,
  scheduleBaptismSchema,
  deleteConvertSchema,
} from "../types/evangelism.validation";

const router = Router();

// protect all evangelism routes
router.use(protect);

// create convert - Evangelism Team, Admin, Super Admin
router.post("/", authorizeRoles("Evangelism Team", "Admin", "Super Admin"), validate(createConvertSchema), EvangelismController.createConvert);

// list / search converts - Evangelism Team, Follow-Up Team, Admin
router.get("/", authorizeRoles("Evangelism Team", "Follow-Up Team", "Admin", "Super Admin"), validate(getConvertsSchema), EvangelismController.getAllConverts);

// get by id
router.get("/:id", authorizeRoles("Evangelism Team", "Follow-Up Team", "Admin", "Super Admin"), EvangelismController.getConvertById);

// update
router.put("/:id", authorizeRoles("Evangelism Team", "Follow-Up Team", "Admin", "Super Admin"), validate(updateConvertSchema), EvangelismController.updateConvert);

// delete - Admin + Super Admin
router.delete("/:id", authorizeRoles("Admin", "Super Admin"), validate(deleteConvertSchema), EvangelismController.deleteConvert);

// assign follow-up leader
router.put("/:id/assign-followup", authorizeRoles("Evangelism Team", "Admin", "Super Admin"), validate(assignFollowUpSchema), EvangelismController.assignFollowUp);

// schedule baptism
router.put("/:id/schedule-baptism", authorizeRoles("Evangelism Team", "Follow-Up Team", "Admin", "Super Admin"), validate(scheduleBaptismSchema), EvangelismController.scheduleBaptism);

export default router;
