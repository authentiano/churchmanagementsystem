import { Router } from "express";
import * as MemberController from "../controllers/member.controller";

const router = Router();

router.post("/", MemberController.createMember);
router.get("/", MemberController.getAllMembers);
router.get("/:id", MemberController.getMemberById);
router.put("/:id", MemberController.updateMember);
router.delete("/:id", MemberController.deleteMember);

export default router;
