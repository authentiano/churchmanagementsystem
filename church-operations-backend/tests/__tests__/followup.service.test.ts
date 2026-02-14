import FollowUp from "../../server/models/followup.model";
import Member from "../../server/models/member.model";
import User from "../../server/models/User";
import * as FollowUpService from "../../server/services/followup.service";

describe("Follow-Up Service", () => {
  let followUpUser: any;
  let member: any;

  beforeEach(async () => {
    await FollowUp.deleteMany({});
    await Member.deleteMany({});
    await User.deleteMany({});

    followUpUser = await User.create({
      name: "Follow-Up Leader",
      email: "followup@test.com",
      password: "hashedpass123",
      role: "Follow-Up Team",
    });

    member = await Member.create({
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      phone: "1234567890",
      memberStatus: "Visitor",
    });
  });

  describe("createFollowUp", () => {
    it("should create a follow-up for a member", async () => {
      const input = {
        targetType: "Member",
        targetId: member._id.toString(),
        priority: "High",
        notes: "New visitor needs follow-up",
      };

      const followUp = await FollowUpService.createFollowUp(input);

      expect(followUp).toBeDefined();
      expect(followUp.targetType).toBe("Member");
      expect(followUp.status).toBe("Pending");
      expect(followUp.priority).toBe("High");
    });

    it("should reject invalid target", async () => {
      const input = {
        targetType: "Member",
        targetId: "000000000000000000000000",
      };

      await expect(FollowUpService.createFollowUp(input)).rejects.toThrow("Target member not found");
    });
  });

  describe("recordAttempt", () => {
    it("should record an attempt", async () => {
      const followUp = await FollowUp.create({
        targetType: "Member",
        targetId: member._id.toString(),
        assignedTo: followUpUser._id.toString(),
        status: "In Progress",
      });

      const updated = await FollowUpService.recordAttempt(followUp._id.toString(), followUpUser._id.toString(), {
        notes: "Called member, no answer",
        outcome: "No Response",
      });

      expect(updated.attempts).toHaveLength(1);
      expect(updated.attempts[0].notes).toBe("Called member, no answer");
      expect(updated.attempts[0].by).toBe(followUpUser._id.toString());
    });

    it("should update status when recording attempt", async () => {
      const followUp = await FollowUp.create({
        targetType: "Member",
        targetId: member._id.toString(),
        status: "Pending",
      });

      const updated = await FollowUpService.recordAttempt(followUp._id.toString(), followUpUser._id.toString(), {
        notes: "Visited member at home",
        status: "Completed",
      });

      expect(updated.status).toBe("Completed");
    });
  });

  describe("getFollowUps", () => {
    beforeEach(async () => {
      await FollowUp.create([
        {
          targetType: "Member",
          targetId: member._id.toString(),
          assignedTo: followUpUser._id.toString(),
          status: "Pending",
        },
        {
          targetType: "Member",
          targetId: member._id.toString(),
          assignedTo: followUpUser._id.toString(),
          status: "Completed",
        },
      ]);
    });

    it("should list all follow-ups with pagination", async () => {
      const result = await FollowUpService.getFollowUps({ page: 1, limit: 10 });

      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it("should filter by status", async () => {
      const result = await FollowUpService.getFollowUps({ page: 1, limit: 10, status: "Pending" });

      expect(result.docs).toHaveLength(1);
      expect(result.docs[0].status).toBe("Pending");
    });

    it("should filter by assignedTo", async () => {
      const result = await FollowUpService.getFollowUps({ page: 1, limit: 10, assignedTo: followUpUser._id.toString() });

      expect(result.docs).toHaveLength(2);
    });
  });

  describe("getPendingForUser", () => {
    beforeEach(async () => {
      await FollowUp.create([
        {
          targetType: "Member",
          targetId: member._id.toString(),
          assignedTo: followUpUser._id.toString(),
          status: "Pending",
        },
        {
          targetType: "Member",
          targetId: member._id.toString(),
          assignedTo: followUpUser._id.toString(),
          status: "Closed",
        },
      ]);
    });

    it("should return pending follow-ups for a user", async () => {
      const result = await FollowUpService.getPendingForUser(followUpUser._id.toString());

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("Pending");
    });
  });
});
