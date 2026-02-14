// server/controllers/auth.controller.ts
console.log("Loading auth.controller.ts");

import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * @desc    Register a new user (Admin, Pastor, etc.)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
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

/**
 * @desc    Login user and get JWT + Refresh Token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token, refreshToken } = await AuthService.loginUser(req.body);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});
