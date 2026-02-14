import { Router } from "express";
import * as MemberController from "../controllers/member.controller";
import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import { validate } from "../utils/validation";

import { 
    createMemberSchema,
    updateMemberSchema,
    deleteMemberSchema,
    getMembersSchema,
} from "../types/member.validation";

const router = Router();

//protect all members

router.use(protect);

//only the admin and the Super Admin can create new members
router.post(
    "/",
    authorizeRoles("Admin", "Super Admin"),
    validate(createMemberSchema),
    MemberController.createMember
);

//all authenticated members can view (supports pagination & filters)
router.get("/", validate(getMembersSchema), MemberController.getAllMembers);
router.get("/:id", MemberController.getMemberById);


//only the admin and the super user can update
router.put(
    "/:id",
    validate(updateMemberSchema),
    authorizeRoles("Admin", "Super Admin"),
    MemberController.updateMember
);

//only the superuse can delete member
router.delete(
    "/:id",
    validate(deleteMemberSchema),
    authorizeRoles("Super Admin"), 
    MemberController.deleteMember
);

export default router;
