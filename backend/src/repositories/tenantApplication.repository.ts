import { prisma } from "../config/db.js";

export class TenantApplicationRepository {
  // Save an inbound public application form submission

  async createApplication(data: {
    propertyId: number;
    roomId?: number;
    bedId?: number;
    name: string;
    phoneNumber: string;
    emergencyContact?: string;
    idProofUrl?: string;
    proposedJoinDate: Date;
  }) {
    return await prisma.tenantApplication.create({
      data: data, // Spreads directly since all fields match the unchecked database schema
    });
  }

  // Get all pending applications for a specific landlord's property
  async getPendingApplicationsByProperty(propertyId: number) {
    return await prisma.tenantApplication.findMany({
      where: { propertyId, status: "Pending" },
      orderBy: { createdAt: "desc" },
    });
  }

  // Find a specific application to process it
  async findApplicationById(id: number) {
    return await prisma.tenantApplication.findUnique({
      where: { id },
    });
  }

  // Find the first available empty bed in a room if a specific bed wasn't selected
  async findFirstAvailableBed(roomId: number) {
    return await prisma.bed.findFirst({
      where: { roomId, isOccupied: false },
    });
  }

  // The critical structural promotion pipeline executed inside a safe database transaction
  async approveApplicationTransaction(
    applicationId: number,
    bedId: number,
    proposedJoinDate: Date,
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Update the application row state to Approved
      const updatedApplication = await tx.tenantApplication.update({
        where: { id: applicationId },
        data: { status: "Approved" },
      });

      // 2. Safely lock the target bed state to occupied
      await tx.bed.update({
        where: { id: bedId },
        data: { isOccupied: true },
      });

      // 3. Migrate the application records directly into the live Tenants table
      const newTenant = await tx.tenant.create({
        data: {
          propertyId: updatedApplication.propertyId,
          bedId: bedId,
          name: updatedApplication.name,
          phoneNumber: updatedApplication.phoneNumber,
          emergencyContact: updatedApplication.emergencyContact,
          idProofUrl: updatedApplication.idProofUrl,
          status: "Active",
          joiningDate: proposedJoinDate,
        },
      });

      return { updatedApplication, newTenant };
    });
  }

  async rejectApplication(id: number) {
    return await prisma.tenantApplication.update({
      where: { id },
      data: { status: "Rejected" },
    });
  }
}
