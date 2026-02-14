import Member from "../../server/models/member.model";
import * as MemberService from "../../server/services/member.service";

describe("Member Service", () => {
  beforeEach(async () => {
    await Member.deleteMany({});
  });

  describe("createMember", () => {
    it("should create a member successfully", async () => {
      const input = {
        firstName: "John",
        lastName: "Doe",
        gender: "Male" as const,
        phone: "1234567890",
        email: "john@example.com",
        memberStatus: "Visitor",
      };

      const member = await MemberService.createMember(input);

      expect(member).toBeDefined();
      expect(member.firstName).toBe("John");
      expect(member.phone).toBe("1234567890");
    });

    it("should reject duplicate phone number", async () => {
      const input = {
        firstName: "John",
        lastName: "Doe",
        gender: "Male" as const,
        phone: "1234567890",
        email: "john@example.com",
      };

      await MemberService.createMember(input);

      await expect(MemberService.createMember(input)).rejects.toThrow(
        "Member with this phone already exists"
      );
    });
  });

  describe("getAllMembers", () => {
    beforeEach(async () => {
      await Member.create([
        {
          firstName: "John",
          lastName: "Doe",
          gender: "Male",
          phone: "1111111111",
          memberStatus: "Visitor",
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          gender: "Female",
          phone: "2222222222",
          memberStatus: "Convert",
        },
        {
          firstName: "Bob",
          lastName: "Johnson",
          gender: "Male",
          phone: "3333333333",
          memberStatus: "Worker",
        },
      ]);
    });

    it("should return all members with pagination", async () => {
      const result = await MemberService.getAllMembers({ page: 1, limit: 10 });

      expect(result.docs).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(1);
    });

    it("should filter by memberStatus", async () => {
      const result = await MemberService.getAllMembers({ page: 1, limit: 10, memberStatus: "Convert" });

      expect(result.docs).toHaveLength(1);
      expect(result.docs[0].memberStatus).toBe("Convert");
    });

    it("should search by firstName", async () => {
      const result = await MemberService.getAllMembers({ page: 1, limit: 10, search: "Jane" });

      expect(result.docs).toHaveLength(1);
      expect(result.docs[0].firstName).toBe("Jane");
    });
  });

  describe("getMemberById", () => {
    it("should return member by ID", async () => {
      const created = await Member.create({
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        phone: "1234567890",
        memberStatus: "Visitor",
      });

      const member = await MemberService.getMemberById(created._id.toString());

      expect(member).toBeDefined();
      expect(member.firstName).toBe("John");
    });

    it("should throw 404 if member not found", async () => {
      await expect(MemberService.getMemberById("000000000000000000000000")).rejects.toThrow("Member not found");
    });
  });

  describe("updateMember", () => {
    it("should update member", async () => {
      const created = await Member.create({
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        phone: "1234567890",
        memberStatus: "Visitor",
      });

      const updated = await MemberService.updateMember(created._id.toString(), { firstName: "Johnny" });

      expect(updated.firstName).toBe("Johnny");
    });

    it("should throw 404 if member not found", async () => {
      await expect(MemberService.updateMember("000000000000000000000000", { firstName: "Test" })).rejects.toThrow("Member not found");
    });
  });

  describe("deleteMember", () => {
    it("should delete member", async () => {
      const created = await Member.create({
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        phone: "1234567890",
        memberStatus: "Visitor",
      });

      const deleted = await MemberService.deleteMember(created._id.toString());

      expect(deleted).toBeDefined();

      const found = await Member.findById(created._id);
      expect(found).toBeNull();
    });

    it("should throw 404 if member not found", async () => {
      await expect(MemberService.deleteMember("000000000000000000000000")).rejects.toThrow("Member not found");
    });
  });
});
