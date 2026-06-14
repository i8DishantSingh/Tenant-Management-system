export interface Bed {
  id: number;
  roomId: number;
  bedNumber: string;
  isOccupied: boolean;
}

export interface Room {
  id: number;
  propertyId: number;
  roomNumber: string;
  floorNumber: number;
  baseRent: string;
  latestMeterReading: string;
  beds: Bed[];
}

export interface PropertyDetails {
  id: number;
  userId: number;
  name: string;
  address: string;
  createdAt: string;
  rooms: Room[];
}

export interface SelectedBedContext {
  propertyId: number;
  propertyName: string;
  roomNumber: string;
  roomId: number;
  bedId: number;
  bedNumber: string;
  isOccupied: boolean;
}
