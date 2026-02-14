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

/** Attendance **/
export const addAttendance = async (cellId: string, payload: { date?: string; present?: string[]; absent?: string[]; notes?: string }) => {
  const cell = await Cell.findById(cellId);
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }

  const date = payload.date ? new Date(payload.date) : new Date();

  const record = { date, present: payload.present || [], absent: payload.absent || [], notes: payload.notes || "" } as any;

  cell.attendanceRecords = cell.attendanceRecords || [];
  cell.attendanceRecords.push(record);
  await cell.save();

  return cell.attendanceRecords[cell.attendanceRecords.length - 1];
};

export const getAttendance = async (cellId: string, opts?: { from?: string; to?: string; page?: number; limit?: number }) => {
  const cell = await Cell.findById(cellId).select("attendanceRecords");
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }

  let records: any[] = (cell.attendanceRecords || []).slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (opts?.from) {
    const from = new Date(opts.from);
    records = records.filter((r) => new Date(r.date) >= from);
  }
  if (opts?.to) {
    const to = new Date(opts.to);
    records = records.filter((r) => new Date(r.date) <= to);
  }

  const page = opts?.page && opts.page > 0 ? opts.page : 1;
  const limit = opts?.limit && opts.limit > 0 ? opts.limit : 10;
  const start = (page - 1) * limit;
  const docs = records.slice(start, start + limit);
  const total = records.length;
  const totalPages = Math.ceil(total / limit);

  return { docs, total, totalPages };
};

/** Metrics & Reports **/
export const getCellMetrics = async (cellId: string, weeks = 4) => {
  const cell = await Cell.findById(cellId).populate("members");
  if (!cell) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }

  const totalMembers = (cell.members || []).length;

  // attendance averages across last `weeks` weeks (look at most recent records)
  const records = (cell.attendanceRecords || []).slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = records.slice(0, Math.max(4, weeks * 1));
  const attendanceCounts = recent.map((r) => (r.present || []).length);
  const avgAttendance = attendanceCounts.length ? Math.round(attendanceCounts.reduce((s, v) => s + v, 0) / attendanceCounts.length) : 0;

  // simple growth indicator: compare average attendance of last `weeks` records vs previous `weeks`
  const window = Math.max(1, weeks);
  const lastWindow = attendanceCounts.slice(0, window);
  const prevWindow = attendanceCounts.slice(window, window * 2);
  const lastAvg = lastWindow.length ? lastWindow.reduce((s, v) => s + v, 0) / lastWindow.length : 0;
  const prevAvg = prevWindow.length ? prevWindow.reduce((s, v) => s + v, 0) / prevWindow.length : 0;
  const growth = prevAvg ? Math.round(((lastAvg - prevAvg) / prevAvg) * 100) : (lastAvg ? 100 : 0);

  // multiplication suggestion: threshold (e.g., if avgAttendance > 30)
  const shouldMultiply = avgAttendance >= 30;

  return { totalMembers, avgAttendance, growthPercent: growth, shouldMultiply };
};

export const multiplyCell = async (cellId: string, payload: { name: string; leader?: string; memberIds?: string[] }) => {
  const parent = await Cell.findById(cellId);
  if (!parent) {
    const err: any = new Error("Cell not found");
    err.statusCode = 404;
    throw err;
  }

  const child = await Cell.create({ name: payload.name, leader: payload.leader || parent.leader, members: payload.memberIds || [], meetingDay: parent.meetingDay, parentCell: parent._id });

  // remove moved members from parent
  if (payload.memberIds && payload.memberIds.length) {
    parent.members = parent.members.filter((m: any) => !payload.memberIds!.map(String).includes(String(m)));
  }

  parent.childrenCells = parent.childrenCells || [];
  parent.childrenCells.push(child._id as any);

  await parent.save();

  // update members' assignedCell
  if (payload.memberIds && payload.memberIds.length) {
    await (await import("../models/member.model")).default.updateMany({ _id: { $in: payload.memberIds } }, { assignedCell: child._id.toString() });
  }

  return child;
};

export const getCellReport = async (cellId: string, opts?: { from?: string; to?: string }) => {
  const metrics = await getCellMetrics(cellId, 4);
  const attendance = await getAttendance(cellId, { from: opts?.from, to: opts?.to, page: 1, limit: 100 });

  return { metrics, attendance };
};