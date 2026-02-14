import Member from "../models/member.model";
import { Cell } from "../models/cell.model";
import { Donation } from "../models/donation.model";

// Fetch summary metrics for dashboard
export const getDashboardMetrics = async () => {
  const totalMembers = await Member.countDocuments();
  const activeCells = await Cell.countDocuments();

  const totalDonationsAgg = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalDonations = totalDonationsAgg[0]?.total || 0;

  return {
    totalMembers,
    activeCells,
    totalDonations,
  };
};
