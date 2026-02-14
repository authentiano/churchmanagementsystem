// Member service
import Member, { IMember } from "../models/member.model";


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
  if (existingMember) {
    const err: any = new Error("Member with this phone already exists");
    err.statusCode = 400;
    throw err;
  }

  const member = await Member.create(input);
  return member;
};

export const getAllMembers = async () => {
  return await Member.find();
};

export const getMemberById = async (id: string) => {
  const member = await Member.findById(id);
  if (!member) {
    const err: any = new Error("Member not found");
    err.statusCode = 404;
    throw err;
  }
  return member;
};

export const updateMember = async (id: string, update: Partial<MemberInput>) => {
  const member = await Member.findByIdAndUpdate(id, update, { new: true });
  if (!member) {
    const err: any = new Error("Member not found");
    err.statusCode = 404;
    throw err;
  }
  return member;
};

export const deleteMember = async (id: string) => {
  const member = await Member.findByIdAndDelete(id);
  if (!member) {
    const err: any = new Error("Member not found");
    err.statusCode = 404;
    throw err;
  }
  return member;
};
