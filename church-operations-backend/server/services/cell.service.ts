import { Cell } from "../models/cell.model";
import Member from "../models/member.model";

interface ListOpts {
  page?: number;
  limit?: number;
  search?: string;
}

export const createCell = async (input: { name: string; leader?: string; meetingDay?: string }) => {
  const existing = await Cell.findOne({ name: input.name });
  if (existing) {
    const err: any = new Error("Cell with this name already exists");
    err.statusCode = 400;
    throw err;
  }

  const cell = await Cell.create(input as any);
  return cell;
};

export const getAllCells = async (opts?: ListOpts) => {
  if (!opts) return await Cell.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.search) {
    const s = opts.search.trim();
    filter.name = new RegExp(s, "i");
  }

  const [docs, total] = await Promise.all([
    Cell.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Cell.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { docs, total, totalPages };
};

export const getCellById = async (id: string) => {
  const cell = await Cell.findById(id).populate({ path: "members", select: "firstName lastName phone email" });
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }
  return cell;
};

export const updateCell = async (id: string, update: Partial<{ name: string; leader: string; meetingDay: string; members: string[] }>) => {
  const cell = await Cell.findByIdAndUpdate(id, update as any, { new: true } as any);
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }
  return cell;
};

export const deleteCell = async (id: string) => {
  const cell = await Cell.findByIdAndDelete(id);
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }
  // unset assignedCell for members
  await Member.updateMany({ _id: { $in: cell.members } }, { $unset: { assignedCell: "" } });
  return cell;
};

export const addMembers = async (cellId: string, memberIds: string[]) => {
  const cell = await Cell.findById(cellId);
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }

  const uniqueToAdd = memberIds.filter((id) => !cell.members.map(String).includes(String(id)));
  if (uniqueToAdd.length === 0) return cell;

  cell.members.push(...uniqueToAdd as any);
  await cell.save();

  // update members assignedCell
  await Member.updateMany({ _id: { $in: uniqueToAdd } }, { assignedCell: cell._id.toString() });

  return await Cell.findById(cellId).populate({ path: "members", select: "firstName lastName phone email" });
};

export const removeMember = async (cellId: string, memberId: string) => {
  const cell = await Cell.findById(cellId);
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }

  cell.members = cell.members.filter((m: any) => String(m) !== String(memberId));
  await cell.save();

  await Member.findByIdAndUpdate(memberId, { $unset: { assignedCell: "" } });

  return await Cell.findById(cellId).populate({ path: "members", select: "firstName lastName phone email" });
};

export const assignLeader = async (cellId: string, leaderId: string) => {
  const cell = await Cell.findByIdAndUpdate(cellId, { leader: leaderId }, { new: true } as any);
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }
  return cell;
};