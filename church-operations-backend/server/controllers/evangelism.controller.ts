import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as EvangelismService from "../services/evangelism.service";

export const createConvert = asyncHandler(async (req: Request, res: Response) => {
  const conv = await EvangelismService.createConvert(req.body);
  res.status(201).json({ status: "success", data: conv });
});

export const getAllConverts = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const page = q.page ?? 1;
  const limit = q.limit ?? 10;
  const status = q.status as string | undefined;
  const search = q.search as string | undefined;

  const { docs, total, totalPages } = await EvangelismService.getAllConverts({ page: Number(page), limit: Number(limit), status, search });

  res.status(200).json({
    status: "success",
    data: { converts: docs, meta: { total, page: Number(page), limit: Number(limit), totalPages } },
  });
});

export const getConvertById = asyncHandler(async (req: Request, res: Response) => {
  const conv = await EvangelismService.getConvertById(req.params.id);
  res.status(200).json({ status: "success", data: conv });
});

export const updateConvert = asyncHandler(async (req: Request, res: Response) => {
  const conv = await EvangelismService.updateConvert(req.params.id, req.body);
  res.status(200).json({ status: "success", data: conv });
});

export const deleteConvert = asyncHandler(async (req: Request, res: Response) => {
  const conv = await EvangelismService.deleteConvert(req.params.id);
  res.status(200).json({ status: "success", data: conv });
});

export const assignFollowUp = asyncHandler(async (req: Request, res: Response) => {
  const conv = await EvangelismService.assignFollowUp(req.params.id, req.body.assignedFollowUp);
  res.status(200).json({ status: "success", data: conv });
});

export const scheduleBaptism = asyncHandler(async (req: Request, res: Response) => {
  const conv = await EvangelismService.scheduleBaptism(req.params.id, req.body.baptismDate);
  res.status(200).json({ status: "success", data: conv });
});
