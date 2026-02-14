import Convert, { IConvert } from "../models/convert.model";
import User from "../models/User";

interface CreateConvertInput {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  dateOfSalvation?: Date | string;
  evangelist?: string;
  notes?: string;
}

export const createConvert = async (input: CreateConvertInput) => {
  // avoid exact duplicate by phone (if provided)
  if (input.phone) {
    const exists = await Convert.findOne({ phone: input.phone });
    if (exists) {
      const err: any = new Error("Convert with this phone already exists");
      err.statusCode = 400;
      throw err;
    }
  }

  const convert = new Convert({
    ...input,
    dateOfSalvation: input.dateOfSalvation ? new Date(input.dateOfSalvation) : undefined,
  });

  // auto-assign to a Follow-Up Team user (simple round-robin / first available)
  const followUpUser = await User.findOne({ role: "Follow-Up Team" });
  if (followUpUser) convert.assignedFollowUp = followUpUser._id.toString();

  await convert.save();
  return convert;
};

export const getAllConverts = async (opts?: { page?: number; limit?: number; status?: string; search?: string }) => {
  if (!opts) return await Convert.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.status) filter.followUpStatus = opts.status;

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
    Convert.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Convert.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { docs, total, totalPages };
};

export const getConvertById = async (id: string) => {
  const conv = await Convert.findById(id);
  if (!conv) {
    const err: any = new Error("Convert not found");
    err.statusCode = 404;
    throw err;
  }
  return conv;
};

export const updateConvert = async (id: string, update: Partial<CreateConvertInput & { followUpStatus?: string; assignedFollowUp?: string; baptismDate?: Date | string; joinedCell?: string }>) => {
  if (update.dateOfSalvation) (update as any).dateOfSalvation = new Date(update.dateOfSalvation as any);

  const conv = await Convert.findByIdAndUpdate(id, update, { new: true });
  if (!conv) {
    const err: any = new Error("Convert not found");
    err.statusCode = 404;
    throw err;
  }
  return conv;
};

export const deleteConvert = async (id: string) => {
  const conv = await Convert.findByIdAndDelete(id);
  if (!conv) {
    const err: any = new Error("Convert not found");
    err.statusCode = 404;
    throw err;
  }
  return conv;
};

export const assignFollowUp = async (id: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "Follow-Up Team") {
    const err: any = new Error("Assigned user must be a Follow-Up Team member");
    err.statusCode = 400;
    throw err;
  }

  const conv = await Convert.findByIdAndUpdate(id, { assignedFollowUp: userId }, { new: true });
  if (!conv) {
    const err: any = new Error("Convert not found");
    err.statusCode = 404;
    throw err;
  }
  return conv;
};

export const scheduleBaptism = async (id: string, baptismDate: Date | string) => {
  const conv = await Convert.findByIdAndUpdate(id, { baptismDate: new Date(baptismDate), followUpStatus: "Baptized" }, { new: true });
  if (!conv) {
    const err: any = new Error("Convert not found");
    err.statusCode = 404;
    throw err;
  }
  return conv;
};
