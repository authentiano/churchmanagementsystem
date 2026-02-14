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

export const getAllMembers = async (opts?: { page?: number; limit?: number; memberStatus?: string; search?: string }) => {
  // if no options supplied, return all members (backwards compatible)
  if (!opts) return await Member.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.memberStatus) filter.memberStatus = opts.memberStatus;

  if (opts.search) {
    const s = opts.search.trim();
    filter.$or = [
      { firstName: new RegExp(s, "i") },
      { lastName: new RegExp(s, "i") },
      { phone: new RegExp(s, "i") },
      { email: new RegExp(s, "i") },
    ];
  }

  const [docs, total] = await Promise.all([
    Member.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Member.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { docs, total, totalPages };
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
