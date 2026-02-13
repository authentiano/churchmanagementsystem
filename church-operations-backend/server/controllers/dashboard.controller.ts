import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as DashboardService from "../services/dashboard.service";

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const metrics = await DashboardService.getDashboardMetrics();

    res.status(200).json({
      status: "success",
      data: metrics,
    });
  }
);
