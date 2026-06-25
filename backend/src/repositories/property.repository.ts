import { prisma } from "../config/db.js";

export class PropertyRepository {
  async createCompletePropertyLayout(propertyData: {
    LandlordId: number;
    name: string;
    address: string;
    roomPayloads: Array<{
      floorNumber: number;
      roomNumber: string;
      baseRent: number;
      beds: Array<{ bedNumber: string }>;
    }>;
  }) {
    return await prisma.$transaction(async (tx) => {
      const property = await tx.property.create({
        data: {
          landlordId: propertyData.LandlordId,
          name: propertyData.name,
          address: propertyData.address,
        },
      });

      for (const roomData of propertyData.roomPayloads) {
        await tx.room.create({
          data: {
            propertyId: property.id,
            floorNumber: roomData.floorNumber,
            roomNumber: roomData.roomNumber,
            baseRent: roomData.baseRent,
            beds: {
              create: roomData.beds.map((bed) => ({
                bedNumber: bed.bedNumber,
              })),
            },
          },
        });
      }

      return property;
    });
  }
  // Fetch all basic property logs for a specific landlord session user
  async LandlordId(landlordId: number) {
    return await prisma.property.findMany({
      where: { landlordId },
      orderBy: { createdAt: "desc" },
    });
  }

  // Deep structural join pass fetching: Property -> Rooms -> Beds
  async findPropertyWithStructureDetails(propertyId: number) {
    return await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        rooms: {
          include: {
            beds: {
              orderBy: { bedNumber: "asc" },
            },
          },
        },
      },
    });
  }
}
