import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as MemberService from "../services/member.service";

export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await MemberService.createMember(req.body);
  res.status(201).json({ status: "success", data: member });
});

export const getAllMembers = asyncHandler(async (_req: Request, res: Response) => {
  const members = await MemberService.getAllMembers();
  res.status(200).json({ status: "success", data: members });
});

export const getMemberById = asyncHandler(async (req: Request, res: Response) => {
  const member = await MemberService.getMemberById(req.params.id);
  res.status(200).json({ status: "success", data: member });
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await MemberService.updateMember(req.params.id, req.body);
  res.status(200).json({ status: "success", data: member });
});

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await MemberService.deleteMember(req.params.id);
  res.status(200).json({ status: "success", data: member });
});
