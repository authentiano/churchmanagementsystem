console.log("loading auth.controller");

import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token, refreshToken } = await AuthService.loginUser(req.body);
  res.status(200).json({
    status: "success",
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token, refreshToken },
  });
});
