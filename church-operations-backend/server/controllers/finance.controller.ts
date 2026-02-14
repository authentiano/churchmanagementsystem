import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as FinanceService from "../services/finance.service";

export const createDonation = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const donation = await FinanceService.createDonation(req.body, user?._id);
  res.status(201).json({ status: "success", data: donation });
});

export const getDonations = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const page = q.page ?? 1;
  const limit = q.limit ?? 10;
  const type = q.type as string | undefined;
  const status = q.status as string | undefined;
  const startDate = q.startDate as string | undefined;
  const endDate = q.endDate as string | undefined;

  const { docs, total, totalPages } = await FinanceService.getDonations({
    page: Number(page),
    limit: Number(limit),
    type,
    status,
    startDate,
    endDate,
  });

  res.status(200).json({
    status: "success",
    data: { donations: docs, meta: { total, page: Number(page), limit: Number(limit), totalPages } },
  });
});

export const getDonationById = asyncHandler(async (req: Request, res: Response) => {
  const donation = await FinanceService.getDonationById(req.params.id);
  res.status(200).json({ status: "success", data: donation });
});

export const updateDonation = asyncHandler(async (req: Request, res: Response) => {
  const donation = await FinanceService.updateDonation(req.params.id, req.body);
  res.status(200).json({ status: "success", data: donation });
});

export const verifyDonation = asyncHandler(async (req: Request, res: Response) => {
  const donation = await FinanceService.verifyDonation(req.params.id, req.body.verificationStatus, req.body.notes);
  res.status(200).json({ status: "success", data: donation });
});

export const deleteDonation = asyncHandler(async (req: Request, res: Response) => {
  const donation = await FinanceService.deleteDonation(req.params.id);
  res.status(200).json({ status: "success", data: donation });
});

export const getFinanceReport = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const startDate = q.startDate as string | undefined;
  const endDate = q.endDate as string | undefined;
  const groupBy = q.groupBy as string | undefined;

  const report = await FinanceService.getFinanceReport({ startDate, endDate, groupBy });
  res.status(200).json({ status: "success", data: report });
});

export const getDonationStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await FinanceService.getDonationStats();
  res.status(200).json({ status: "success", data: stats });
});
