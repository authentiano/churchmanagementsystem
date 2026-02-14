import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as FollowUpService from "../services/followup.service";

export const createFollowUp = asyncHandler(async (req: Request, res: Response) => {
  const f = await FollowUpService.createFollowUp(req.body, (req as any).user?._id);
  res.status(201).json({ status: "success", data: f });
});

export const getFollowUps = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const page = q.page ?? 1;
  const limit = q.limit ?? 10;
  const status = q.status as string | undefined;
  const assignedTo = q.assignedTo as string | undefined;
  const targetType = q.targetType as string | undefined;
  const search = q.search as string | undefined;

  const { docs, total, totalPages } = await FollowUpService.getFollowUps({ page: Number(page), limit: Number(limit), status, assignedTo, targetType, search });
  res.status(200).json({ status: "success", data: { followUps: docs, meta: { total, page: Number(page), limit: Number(limit), totalPages } } });
});

export const getFollowUpById = asyncHandler(async (req: Request, res: Response) => {
  const f = await FollowUpService.getFollowUpById(req.params.id);
  res.status(200).json({ status: "success", data: f });
});

export const updateFollowUp = asyncHandler(async (req: Request, res: Response) => {
  const f = await FollowUpService.updateFollowUp(req.params.id, req.body);
  res.status(200).json({ status: "success", data: f });
});

export const deleteFollowUp = asyncHandler(async (req: Request, res: Response) => {
  const f = await FollowUpService.deleteFollowUp(req.params.id);
  res.status(200).json({ status: "success", data: f });
});

export const recordAttempt = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const f = await FollowUpService.recordAttempt(req.params.id, user?._id, req.body);
  res.status(200).json({ status: "success", data: f });
});

export const getPending = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const docs = await FollowUpService.getPendingForUser(user._id);
  res.status(200).json({ status: "success", data: docs });
});

export const triggerReminders = asyncHandler(async (_req: Request, res: Response) => {
  const count = await FollowUpService.runDueReminders();
  res.status(200).json({ status: "success", data: { triggered: count } });
});
