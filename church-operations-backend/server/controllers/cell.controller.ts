import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as CellService from "../services/cell.service";

export const createCell = asyncHandler(async (req: Request, res: Response) => {
  const cell = await CellService.createCell(req.body);
  res.status(201).json({ status: "success", data: cell });
});

export const getAllCells = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const page = Number(q.page || 1);
  const limit = Number(q.limit || 10);
  const search = q.search as string | undefined;

  const { docs, total, totalPages } = await CellService.getAllCells({ page, limit, search });
  res.status(200).json({ status: "success", data: { cells: docs, meta: { total, page, limit, totalPages } } });
});

export const getCellById = asyncHandler(async (req: Request, res: Response) => {
  const cell = await CellService.getCellById(req.params.id);
  res.status(200).json({ status: "success", data: cell });
});

export const updateCell = asyncHandler(async (req: Request, res: Response) => {
  const cell = await CellService.updateCell(req.params.id, req.body);
  res.status(200).json({ status: "success", data: cell });
});

export const deleteCell = asyncHandler(async (req: Request, res: Response) => {
  const cell = await CellService.deleteCell(req.params.id);
  res.status(200).json({ status: "success", data: cell });
});

export const addMembers = asyncHandler(async (req: Request, res: Response) => {
  const { memberIds } = req.body as any;
  const cell = await CellService.addMembers(req.params.id, memberIds);
  res.status(200).json({ status: "success", data: cell });
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const cell = await CellService.removeMember(req.params.id, req.params.memberId);
  res.status(200).json({ status: "success", data: cell });
});

export const assignLeader = asyncHandler(async (req: Request, res: Response) => {
  const { leaderId } = req.body as any;
  const cell = await CellService.assignLeader(req.params.id, leaderId);
  res.status(200).json({ status: "success", data: cell });
});

export const addAttendance = asyncHandler(async (req: Request, res: Response) => {
  const record = await CellService.addAttendance(req.params.id, req.body);
  res.status(201).json({ status: "success", data: record });
});

export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const page = Number(q.page || 1);
  const limit = Number(q.limit || 10);
  const from = q.from as string | undefined;
  const to = q.to as string | undefined;

  const result = await CellService.getAttendance(req.params.id, { from, to, page, limit });
  res.status(200).json({ status: "success", data: result });
});

export const getMetrics = asyncHandler(async (req: Request, res: Response) => {
  const weeks = Number((req.query as any).weeks || 4);
  const metrics = await CellService.getCellMetrics(req.params.id, weeks);
  res.status(200).json({ status: "success", data: metrics });
});

export const multiply = asyncHandler(async (req: Request, res: Response) => {
  const child = await CellService.multiplyCell(req.params.id, req.body);
  res.status(201).json({ status: "success", data: child });
});

export const getReport = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const report = await CellService.getCellReport(req.params.id, { from: q.from, to: q.to });
  res.status(200).json({ status: "success", data: report });
});