import { PropertyRepository } from "../repositories/property.repository.js";

const propertyRepo = new PropertyRepository();

export class PropertyService {
  async initializeNewLandlordProperty(onboardingData: {
    userId: number;
    name: string;
    address: string;
    totalFloors: number;
    roomsPerFloor: number;
    bedsPerRoom: number;
    baseRentPerBed: number;
  }) {
    const roomPayloads = [];

    for (let floor = 0; floor < onboardingData.totalFloors; floor++) {
      for (
        let roomIdx = 1;
        roomIdx <= onboardingData.roomsPerFloor;
        roomIdx++
      ) {
        const padding = roomIdx < 10 ? "0" : "";
        const roomNumber = `${floor}${padding}${roomIdx}`;

        const beds = [];
        for (let bedIdx = 1; bedIdx <= onboardingData.bedsPerRoom; bedIdx++) {
          beds.push({ bedNumber: `Bed-${bedIdx}` });
        }

        roomPayloads.push({
          floorNumber: floor,
          roomNumber: roomNumber,
          baseRent: onboardingData.baseRentPerBed,
          beds: beds,
        });
      }
    }

    return await propertyRepo.createCompletePropertyLayout({
      LandlordId: onboardingData.userId,
      name: onboardingData.name,
      address: onboardingData.address,
      roomPayloads,
    });
  }

  // FIXED: Funneling call directly through repo layer
  async getPropertiesByUserId(userId: number) {
    return await propertyRepo.LandlordId(userId);
  }

  // FIXED: Funneling call directly through repo layer
  async getPropertyWithStructureDetails(propertyId: number) {
    return await propertyRepo.findPropertyWithStructureDetails(propertyId);
  }
}
