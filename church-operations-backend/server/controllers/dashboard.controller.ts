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

export const getEvangelismAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await DashboardService.getEvangelismAnalytics();
  res.status(200).json({ status: "success", data });
});

export const getFollowUpAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await DashboardService.getFollowUpAnalytics();
  res.status(200).json({ status: "success", data });
});

export const getCellAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await DashboardService.getCellAnalytics();
  res.status(200).json({ status: "success", data });
});

export const getFinanceAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await DashboardService.getFinanceAnalytics();
  res.status(200).json({ status: "success", data });
});

export const getCommunicationAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await DashboardService.getCommunicationAnalytics();
  res.status(200).json({ status: "success", data });
});

export const getFinanceAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await DashboardService.getFinanceAnalytics();
  res.status(200).json({ status: "success", data });
});
