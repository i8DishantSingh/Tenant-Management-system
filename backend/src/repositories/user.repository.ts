import { prisma } from "../config/db.js";

export class landlordRepository {
  async findByEmail(email: string) {
    return await prisma.landlord.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return await prisma.landlord.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phoneNumber: true }, // Exclude password hash from leaking
    });
  }

  async createlandlord(data: {
    name: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
  }) {
    return await prisma.landlord.create({
      data,
      select: { id: true, name: true, email: true },
    });
  }
}
