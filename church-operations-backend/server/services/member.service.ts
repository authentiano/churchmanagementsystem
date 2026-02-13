//this is for the member service

import Member, { IMember } from "../models/Member";

interface MemberInput {
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  address?: string;
  dateOfBirth?: Date;
  salvationStatus?: boolean;
  baptismStatus?: boolean;
  memberStatus?: string;
  assignedCell?: string;
  assignedFollowUpLeader?: string;
  profilePhoto?: string;
}

export const createMember = async (input: MemberInput) => {
  const existingMember = await Member.findOne({ phone: input.phone });
  if (existingMember) throw new Error("Member with this phone already exists");

  const member = await Member.create(input);
  return member;
};

export const getAllMembers = async () => {
  return await Member.find();
};

export const getMemberById = async (id: string) => {
  const member = await Member.findById(id);
  if (!member) throw new Error("Member not found");
  return member;
};

export const updateMember = async (id: string, update: Partial<MemberInput>) => {
  const member = await Member.findByIdAndUpdate(id, update, { new: true });
  if (!member) throw new Error("Member not found");
  return member;
};

export const deleteMember = async (id: string) => {
  const member = await Member.findByIdAndDelete(id);
  if (!member) throw new Error("Member not found");
  return member;
};
