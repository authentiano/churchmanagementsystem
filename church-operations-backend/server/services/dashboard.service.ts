import Member from "../models/member.model";
import { Cell } from "../models/cell.model";
import { Donation } from "../models/donation.model";
import Convert from "../models/convert.model";
import FollowUp from "../models/followup.model";
import SMSLog from "../models/sms.model";
import WhatsAppMessage from "../models/whatsapp.model";
import EmailCampaign from "../models/emailcampaign.model";

// Fetch summary metrics for dashboard
export const getDashboardMetrics = async () => {
  const totalMembers = await Member.countDocuments();
  const activeCells = await Cell.countDocuments();

  const totalDonationsAgg = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalDonations = totalDonationsAgg[0]?.total || 0;

  // Evangelism & Follow-Up metrics
  const totalConverts = await Convert.countDocuments();
  const baptizedConverts = await Convert.countDocuments({ followUpStatus: "Baptized" });
  const pendingFollowUps = await FollowUp.countDocuments({ status: { $ne: "Closed" } });
  const completedFollowUps = await FollowUp.countDocuments({ status: "Completed" });

  // Cell metrics
  const cellsWithAttendance = await Cell.countDocuments({ "attendanceRecords.0": { $exists: true } });
  const avgCellSize = totalMembers > 0 ? Math.round(totalMembers / activeCells) : 0;

  const conversionRate = totalConverts > 0 ? Math.round((baptizedConverts / totalConverts) * 100) : 0;

  return {
    totalMembers,
    activeCells,
    totalDonations,
    evangelism: {
      totalConverts,
      baptizedConverts,
      conversionRate: `${conversionRate}%`,
    },
    followUp: {
      pending: pendingFollowUps,
      completed: completedFollowUps,
    },
    cells: {
      active: activeCells,
      cellsWithAttendance,
      avgCellSize,
    },
  };
};

export const getEvangelismAnalytics = async () => {
  const totalConverts = await Convert.countDocuments();
  const byStatus = await Convert.aggregate([
    { $group: { _id: "$followUpStatus", count: { $sum: 1 } } },
  ]);

  const statusMap: any = {};
  byStatus.forEach((item) => {
    statusMap[item._id] = item.count;
  });

  const baptizedConverts = await Convert.countDocuments({ followUpStatus: "Baptized" });
  const conversionRate = totalConverts > 0 ? Math.round((baptizedConverts / totalConverts) * 100) : 0;

  return {
    totalConverts,
    statusBreakdown: statusMap,
    baptizedConverts,
    conversionRatePercent: conversionRate,
  };
};

export const getFollowUpAnalytics = async () => {
  const totalFollowUps = await FollowUp.countDocuments();
  const byStatus = await FollowUp.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusMap: any = {};
  byStatus.forEach((item) => {
    statusMap[item._id] = item.count;
  });

  const byType = await FollowUp.aggregate([
    { $group: { _id: "$targetType", count: { $sum: 1 } } },
  ]);

  const typeMap: any = {};
  byType.forEach((item) => {
    typeMap[item._id] = item.count;
  });

  const completionRate = totalFollowUps > 0 ? Math.round(((statusMap["Completed"] || 0) / totalFollowUps) * 100) : 0;

  return {
    totalFollowUps,
    statusBreakdown: statusMap,
    typeBreakdown: typeMap,
    completionRatePercent: completionRate,
  };
};

export const getCellAnalytics = async () => {
  const totalCells = await Cell.countDocuments();
  const totalMembers = await Member.countDocuments();
  const cellsWithAttendance = await Cell.countDocuments({ "attendanceRecords.0": { $exists: true } });

  const avgCellSize = totalCells > 0 ? Math.round(totalMembers / totalCells) : 0;

  const cellMetrics = await Cell.aggregate([
    {
      $project: {
        name: 1,
        leader: 1,
        memberCount: { $size: { $ifNull: ["$members", []] } },
        attendanceCount: { $size: { $ifNull: ["$attendanceRecords", []] } },
      },
    },
  ]);

  return {
    totalCells,
    cellsWithAttendance,
    avgCellSize,
    topCells: cellMetrics.slice(0, 5),
  };
};

export const getFinanceAnalytics = async () => {
  const totalDonations = await Donation.countDocuments();

  const byType = await Donation.aggregate([
    { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  const byStatus = await Donation.aggregate([
    { $group: { _id: "$verificationStatus", total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  const typeMap: any = {};
  let totalAmount = 0;
  byType.forEach((item) => {
    typeMap[item._id] = { amount: item.total, count: item.count };
    totalAmount += item.total;
  });

  const statusMap: any = {};
  byStatus.forEach((item) => {
    statusMap[item._id] = { amount: item.total, count: item.count };
  });

  const verifiedAmount = statusMap["Verified"]?.amount || 0;

  return {
    totalDonations,
    totalAmount,
    verifiedAmount,
    typeBreakdown: typeMap,
    statusBreakdown: statusMap,
  };
};

export const getCommunicationAnalytics = async () => {
  const smsStats = await SMSLog.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const smsByStatus: any = {};
  let totalSMS = 0;
  smsStats.forEach((item) => {
    smsByStatus[item._id] = item.count;
    totalSMS += item.count;
  });

  const whatsappStats = await WhatsAppMessage.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const whatsappByStatus: any = {};
  let totalWhatsApp = 0;
  whatsappStats.forEach((item) => {
    whatsappByStatus[item._id] = item.count;
    totalWhatsApp += item.count;
  });

  const emailStats = await EmailCampaign.countDocuments({ status: "Sent" });

  return {
    sms: { totalSent: totalSMS, byStatus: smsByStatus },
    whatsapp: { totalSent: totalWhatsApp, byStatus: whatsappByStatus },
    email: { campaignsSent: emailStats },
  };
};
