import { prisma } from "../config/db.js";

export class MaintenanceRepository {
  // Query all incidents mapped to a specific property asset
  async findByProperty(propertyId: number) {
    return await prisma.maintenanceTicket.findMany({
      where: { propertyId },
      orderBy: { createdAt: "desc" },
    });
  }

  // Find a specific ticket context by its unique identifier
  async findById(id: number) {
    return await prisma.maintenanceTicket.findUnique({
      where: { id },
    });
  }

  // Create a brand new incident report entry row in the database table
  async createTicket(data: {
    propertyId: number;
    roomNumber: string;
    category: string;
    description: string;
    severity: string;
  }) {
    return await prisma.maintenanceTicket.create({
      data: {
        ...data,
        status: "Open", // Enforces baseline status upon creation pass
      },
    });
  }

  // Update an active ticket's state status loop string context on toggle clicks
  async updateStatus(id: number, status: string) {
    return await prisma.maintenanceTicket.update({
      where: { id },
      data: { status },
    });
  }
}
