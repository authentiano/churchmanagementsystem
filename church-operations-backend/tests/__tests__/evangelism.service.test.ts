import Convert from "../../server/models/convert.model";
import User from "../../server/models/User";
import * as EvangelismService from "../../server/services/evangelism.service";

describe("Evangelism Service", () => {
  beforeEach(async () => {
    await Convert.deleteMany({});
    await User.deleteMany({});
  });

  describe("createConvert", () => {
    it("should create a convert with auto-assigned follow-up user", async () => {
      // Create a Follow-Up Team user
      const followUpUser = await User.create({
        name: "Follow-Up Leader",
        email: "followup@test.com",
        password: "hashedpass123",
        role: "Follow-Up Team",
      });

      const input = {
        firstName: "James",
        phone: "9876543210",
        evangelist: "evan123",
      };

      const convert = await EvangelismService.createConvert(input);

      expect(convert).toBeDefined();
      expect(convert.firstName).toBe("James");
      expect(convert.assignedFollowUp).toBe(followUpUser._id.toString());
      expect(convert.followUpStatus).toBe("Pending");
    });

    it("should reject duplicate phone number", async () => {
      const input = {
        firstName: "James",
        phone: "9876543210",
      };

      await EvangelismService.createConvert(input);

      await expect(EvangelismService.createConvert(input)).rejects.toThrow("Convert with this phone already exists");
    });
  });

  describe("getAllConverts", () => {
    beforeEach(async () => {
      await Convert.create([
        { firstName: "Convert1", phone: "1111111111", followUpStatus: "Pending" },
        { firstName: "Convert2", phone: "2222222222", followUpStatus: "Baptized" },
        { firstName: "Convert3", phone: "3333333333", followUpStatus: "Pending" },
      ]);
    });

    it("should return all converts with pagination", async () => {
      const result = await EvangelismService.getAllConverts({ page: 1, limit: 10 });

      expect(result.docs).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it("should filter by status", async () => {
      const result = await EvangelismService.getAllConverts({ page: 1, limit: 10, status: "Baptized" });

      expect(result.docs).toHaveLength(1);
      expect(result.docs[0].followUpStatus).toBe("Baptized");
    });

    it("should search by firstName", async () => {
      const result = await EvangelismService.getAllConverts({ page: 1, limit: 10, search: "Convert2" });

      expect(result.docs).toHaveLength(1);
      expect(result.docs[0].firstName).toBe("Convert2");
    });
  });

  describe("assignFollowUp", () => {
    it("should assign follow-up user to convert", async () => {
      const followUpUser = await User.create({
        name: "Follow-Up Leader",
        email: "followup@test.com",
        password: "hashedpass123",
        role: "Follow-Up Team",
      });

      const convert = await Convert.create({
        firstName: "Test",
        phone: "5555555555",
        followUpStatus: "Pending",
      });

      const updated = await EvangelismService.assignFollowUp(convert._id.toString(), followUpUser._id.toString());

      expect(updated.assignedFollowUp).toBe(followUpUser._id.toString());
    });

    it("should reject non-Follow-Up Team user", async () => {
      const admin = await User.create({
        name: "Admin",
        email: "admin@test.com",
        password: "hashedpass123",
        role: "Admin",
      });

      const convert = await Convert.create({
        firstName: "Test",
        phone: "5555555555",
        followUpStatus: "Pending",
      });

      await expect(EvangelismService.assignFollowUp(convert._id.toString(), admin._id.toString())).rejects.toThrow("Assigned user must be a Follow-Up Team member");
    });
  });

  describe("scheduleBaptism", () => {
    it("should schedule baptism and update status", async () => {
      const convert = await Convert.create({
        firstName: "Test",
        phone: "5555555555",
        followUpStatus: "Pending",
      });

      const baptismDate = new Date("2026-03-15");
      const updated = await EvangelismService.scheduleBaptism(convert._id.toString(), baptismDate);

      expect(updated.baptismDate).toEqual(baptismDate);
      expect(updated.followUpStatus).toBe("Baptized");
    });
  });
});
