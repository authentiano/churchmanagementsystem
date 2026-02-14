import FollowUp, { IFollowUp } from "../models/followup.model";
import Member from "../models/member.model";
import Convert from "../models/convert.model";
import User from "../models/User";
import { sendFollowUpReminder } from "../utils/notifications";

export const createFollowUp = async (input: any, createdBy?: string) => {
  // validate target exists
  if (input.targetType === "Member") {
    const m = await Member.findById(input.targetId);
    if (!m) {
      const err: any = new Error("Target member not found");
      err.statusCode = 404;
      throw err;
    }
  } else {
    const c = await Convert.findById(input.targetId);
    if (!c) {
      const err: any = new Error("Target convert not found");
      err.statusCode = 404;
      throw err;
    }
  }

  const doc: any = {
    targetType: input.targetType,
    targetId: input.targetId,
    scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    priority: input.priority || "Medium",
    createdBy,
  };

  // assign to provided user or pick first Follow-Up Team user
  if (input.assignedTo) {
    const u = await User.findById(input.assignedTo);
    if (!u || u.role !== "Follow-Up Team") {
      const err: any = new Error("Assigned user must be a Follow-Up Team member");
      err.statusCode = 400;
      throw err;
    }
    doc.assignedTo = input.assignedTo;
  } else {
    const followUpUser = await User.findOne({ role: "Follow-Up Team" });
    if (followUpUser) doc.assignedTo = followUpUser._id.toString();
  }

  if (input.notes) doc.attempts = [{ notes: input.notes, attemptedAt: new Date(), outcome: "Created" }];

  const f = await FollowUp.create(doc);
  return f;
};

export const getFollowUps = async (opts?: { page?: number; limit?: number; status?: string; assignedTo?: string; targetType?: string; search?: string }) => {
  if (!opts) return FollowUp.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.status) filter.status = opts.status;
  if (opts.assignedTo) filter.assignedTo = opts.assignedTo;
  if (opts.targetType) filter.targetType = opts.targetType;

  if (opts.search) {
    const s = opts.search.trim();
    // search across targetId or attempts notes
    filter.$or = [{ targetId: new RegExp(s, "i") }, { "attempts.notes": new RegExp(s, "i") }];
  }

  const [docs, total] = await Promise.all([
    FollowUp.find(filter).skip(skip).limit(limit).sort({ updatedAt: -1 }),
    FollowUp.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { docs, total, totalPages };
};

export const getFollowUpById = async (id: string) => {
  const f = await FollowUp.findById(id);
  if (!f) {
    const err: any = new Error("Follow-up not found");
    err.statusCode = 404;
    throw err;
  }
  return f;
};

export const updateFollowUp = async (id: string, update: any) => {
  if (update.scheduledAt) (update as any).scheduledAt = new Date(update.scheduledAt);
  const f = await FollowUp.findByIdAndUpdate(id, update, { new: true });
  if (!f) {
    const err: any = new Error("Follow-up not found");
    err.statusCode = 404;
    throw err;
  }
  return f;
};

export const deleteFollowUp = async (id: string) => {
  const f = await FollowUp.findByIdAndDelete(id);
  if (!f) {
    const err: any = new Error("Follow-up not found");
    err.statusCode = 404;
    throw err;
  }
  return f;
};

export const recordAttempt = async (id: string, by: string | undefined, attempt: { notes?: string; outcome?: string; nextAttemptAt?: Date | string; status?: string }) => {
  const f = await FollowUp.findById(id);
  if (!f) {
    const err: any = new Error("Follow-up not found");
    err.statusCode = 404;
    throw err;
  }

  const rec: any = { attemptedAt: new Date() };
  if (by) rec.by = by;
  if (attempt.notes) rec.notes = attempt.notes;
  if (attempt.outcome) rec.outcome = attempt.outcome;

  f.attempts.push(rec);

  if (attempt.nextAttemptAt) f.nextAttemptAt = new Date(attempt.nextAttemptAt as any);
  if (attempt.status) f.status = attempt.status as any;

  await f.save();
  return f;
};

export const getPendingForUser = async (userId: string) => {
  // return follow-ups assigned to user and not closed
  const now = new Date();
  const docs = await FollowUp.find({ assignedTo: userId, status: { $ne: "Closed" } }).sort({ nextAttemptAt: 1, priority: -1 });
  return docs;
};

export const runDueReminders = async () => {
  // find follow-ups that are due (scheduledAt or nextAttemptAt <= now) and not closed
  const now = new Date();
  const due = await FollowUp.find({ status: { $ne: "Closed" }, $or: [{ scheduledAt: { $lte: now } }, { nextAttemptAt: { $lte: now } }] });

  for (const f of due) {
    if (!f.assignedTo) continue;
    const user = await User.findById(f.assignedTo);
    if (!user) continue;
    // send reminder (stub)
    // eslint-disable-next-line no-console
    await sendFollowUpReminder(user, f);
  }

  return due.length;
};
