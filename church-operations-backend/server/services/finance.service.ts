import { Donation } from "../models/donation.model";

interface DonationInput {
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  memberId?: string;
  amount: number;
  currency?: string;
  type: string;
  description?: string;
  paymentMethod: string;
  dateReceived?: Date | string;
  receiptNumber?: string;
  notes?: string;
  recordedBy?: string;
}

export const createDonation = async (input: DonationInput, recordedBy?: string) => {
  const doc: any = {
    ...input,
    recordedBy: recordedBy || input.recordedBy,
    currency: input.currency || "USD",
    dateReceived: input.dateReceived ? new Date(input.dateReceived) : new Date(),
  };

  const donation = await Donation.create(doc);
  return donation;
};

export const getDonations = async (opts?: { page?: number; limit?: number; type?: string; status?: string; startDate?: string; endDate?: string }) => {
  if (!opts) return Donation.find();

  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (opts.type) filter.type = opts.type;
  if (opts.status) filter.verificationStatus = opts.status;

  if (opts.startDate || opts.endDate) {
    filter.dateReceived = {};
    if (opts.startDate) filter.dateReceived.$gte = new Date(opts.startDate);
    if (opts.endDate) filter.dateReceived.$lte = new Date(opts.endDate);
  }

  const [docs, total] = await Promise.all([
    Donation.find(filter).skip(skip).limit(limit).sort({ dateReceived: -1 }),
    Donation.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { docs, total, totalPages };
};

export const getDonationById = async (id: string) => {
  const donation = await Donation.findById(id);
  if (!donation) {
    const err: any = new Error("Donation not found");
    err.statusCode = 404;
    throw err;
  }
  return donation;
};

export const updateDonation = async (id: string, update: Partial<DonationInput>) => {
  if (update.dateReceived && typeof update.dateReceived === "string") {
    (update as any).dateReceived = new Date(update.dateReceived);
  }

  const donation = await Donation.findByIdAndUpdate(id, update, { new: true });
  if (!donation) {
    const err: any = new Error("Donation not found");
    err.statusCode = 404;
    throw err;
  }
  return donation;
};

export const verifyDonation = async (id: string, verificationStatus: "Verified" | "Rejected", notes?: string) => {
  const donation = await Donation.findByIdAndUpdate(id, { verificationStatus, notes }, { new: true });
  if (!donation) {
    const err: any = new Error("Donation not found");
    err.statusCode = 404;
    throw err;
  }
  return donation;
};

export const deleteDonation = async (id: string) => {
  const donation = await Donation.findByIdAndDelete(id);
  if (!donation) {
    const err: any = new Error("Donation not found");
    err.statusCode = 404;
    throw err;
  }
  return donation;
};

export const getFinanceReport = async (opts?: { startDate?: string; endDate?: string; groupBy?: string }) => {
  const filter: any = {};

  if (opts?.startDate || opts?.endDate) {
    filter.dateReceived = {};
    if (opts?.startDate) filter.dateReceived.$gte = new Date(opts.startDate);
    if (opts?.endDate) filter.dateReceived.$lte = new Date(opts.endDate);
    if (opts?.endDate) {
      // Add 1 day to endDate to include the entire day
      const endDate = new Date(opts.endDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.dateReceived.$lte = endDate;
    }
  }

  const groupBy = opts?.groupBy || "type";

  let pipeline: any[] = [{ $match: filter }];

  if (groupBy === "type") {
    pipeline.push({
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        verified: { $sum: { $cond: [{ $eq: ["$verificationStatus", "Verified"] }, "$amount", 0] } },
        pending: { $sum: { $cond: [{ $eq: ["$verificationStatus", "Pending"] }, "$amount", 0] } },
      },
    });
  } else if (groupBy === "daily") {
    pipeline.push({
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateReceived" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    });
    pipeline.push({ $sort: { _id: 1 } });
  } else if (groupBy === "monthly") {
    pipeline.push({
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$dateReceived" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    });
    pipeline.push({ $sort: { _id: 1 } });
  }

  // Add grand total
  pipeline.push({
    $facet: {
      byCategory: pipeline,
      summary: [{ $group: { _id: null, totalAmount: { $sum: "$amount" }, totalCount: { $sum: 1 } } }],
    },
  });

  const result = await Donation.aggregate(pipeline);

  return {
    data: result[0]?.byCategory || [],
    summary: result[0]?.summary[0] || { totalAmount: 0, totalCount: 0 },
  };
};

export const getDonationStats = async () => {
  const stats = await Donation.aggregate([
    {
      $facet: {
        totalByType: [{ $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } }],
        totalByStatus: [{ $group: { _id: "$verificationStatus", total: { $sum: "$amount" }, count: { $sum: 1 } } }],
        summary: [{ $group: { _id: null, totalAmount: { $sum: "$amount" }, totalCount: { $sum: 1 } } }],
        monthlyTrend: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$dateReceived" } },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 12 },
        ],
      },
    },
  ]);

  return stats[0];
};
