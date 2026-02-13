console.log("Loading auth.routes.ts");


import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { validate } from "../utils/validation";
import { registerSchema, loginSchema } from "../types/auth.validation";

const router = Router();

//applying the schema in the routes

router.post(
    "/register",
    validate(registerSchema),
    AuthController.register
);

router.post(
    "/login",
    validate(loginSchema), 
    AuthController.login
);

export default router;
