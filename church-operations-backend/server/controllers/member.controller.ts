import { Request, Response } from "express";
import * as MemberService from "../services/member.service";

export const createMember = async (req: Request, res: Response) => {
  try {
    const member = await MemberService.createMember(req.body);
    res.status(201).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await MemberService.getAllMembers();
    res.status(200).json({ status: "success", data: members });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const member = await MemberService.getMemberById(req.params.id);
    res.status(200).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const member = await MemberService.updateMember(req.params.id, req.body);
    res.status(200).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const member = await MemberService.deleteMember(req.params.id);
    res.status(200).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(404).json({ status: "error", message: error.message });
  }
};
