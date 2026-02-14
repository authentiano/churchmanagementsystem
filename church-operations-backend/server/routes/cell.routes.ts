import { Router } from "express";
import * as CellController from "../controllers/cell.controller";
import { validate } from "../utils/validation";
import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import {
  createCellSchema,
  updateCellSchema,
  assignLeaderSchema,
  addMembersSchema,
  getCellsSchema,
} from "../types/cell.validation";

const router = Router();

// protect all cell routes
router.use(protect);

// create cell - Admin + Super Admin
router.post("/", authorizeRoles("Admin", "Super Admin"), validate(createCellSchema), CellController.createCell);

// list cells (paginated)
router.get("/", validate(getCellsSchema), CellController.getAllCells);

// get cell by id
router.get("/:id", CellController.getCellById);

// update - Admin + Super Admin
router.put("/:id", validate(updateCellSchema), authorizeRoles("Admin", "Super Admin"), CellController.updateCell);

// delete - Super Admin
router.delete("/:id", authorizeRoles("Super Admin"), CellController.deleteCell);

// assign leader - Admin + Super Admin
router.put("/:id/leader", validate(assignLeaderSchema), authorizeRoles("Admin", "Super Admin"), CellController.assignLeader);

// add members to cell - Admin + Cell Leader
router.post("/:id/members", validate(addMembersSchema), authorizeRoles("Admin", "Cell Leader"), CellController.addMembers);

// remove member from cell - Admin + Cell Leader
router.delete("/:id/members/:memberId", authorizeRoles("Admin", "Cell Leader"), CellController.removeMember);

// attendance: add / list
router.post("/:id/attendance", validate(createAttendanceSchema), authorizeRoles("Admin", "Cell Leader"), CellController.addAttendance);
router.get("/:id/attendance", validate(getAttendanceSchema), CellController.getAttendance);

// metrics, multiply, reports
router.get("/:id/metrics", validate(getMetricsSchema), authorizeRoles("Admin", "Cell Leader", "Super Admin"), CellController.getMetrics);
router.post("/:id/multiply", validate(multiplyCellSchema), authorizeRoles("Admin", "Super Admin"), CellController.multiply);
router.get("/:id/reports", validate(getCellReportSchema), authorizeRoles("Admin", "Super Admin"), CellController.getReport);

export default router;