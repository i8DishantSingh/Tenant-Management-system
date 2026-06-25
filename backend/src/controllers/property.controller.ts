import { Request, Response } from "express";
import { PropertyService } from "../services/property.service.js";

const propertyService = new PropertyService();

// Define a type extension inline to capture your authentication middleware parameters safely
interface AuthenticatedRequest extends Request {
  userId?: number;
  user?: { id: number };
}

export class PropertyController {
  // 1. Existing Generation Loop Controller (Updated with session verification extraction)
  async registerAndSetupLayout(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const {
        name,
        address,
        totalFloors,
        roomsPerFloor,
        bedsPerRoom,
        baseRentPerBed,
      } = req.body;

      // Automatically fallback to user parsing session variables injected by requireAuth middleware
      const sessionUserId = req.userId || req.user?.id;
      const targetUserId = sessionUserId
        ? Number(sessionUserId)
        : Number(req.body.userId);

      if (
        !targetUserId ||
        !name ||
        !address ||
        !totalFloors ||
        !roomsPerFloor ||
        !bedsPerRoom ||
        !baseRentPerBed
      ) {
        res.status(400).json({
          error:
            "Missing required onboarding parameters. Please provide all layout specifications.",
        });
        return;
      }

      const property = await propertyService.initializeNewLandlordProperty({
        userId: targetUserId,
        name,
        address,
        totalFloors: Number(totalFloors),
        roomsPerFloor: Number(roomsPerFloor),
        bedsPerRoom: Number(bedsPerRoom),
        baseRentPerBed: Number(baseRentPerBed),
      });

      res.status(201).json({
        message: "Property layout generated successfully!",
        propertyId: property.id,
        propertyName: property.name,
      });
    } catch (error: any) {
      console.error("❌ Onboarding Controller Error:", error);
      res.status(500).json({
        error:
          "Internal Server Error occurred during property generation processing.",
        details: error.message,
      });
    }
  }

  // 2. NEW METHOD: Fetch summary array of all properties linked to active session
  async getLandlordProperties(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const sessionUserId = req.userId || req.user?.id;

      if (!sessionUserId) {
        res
          .status(401)
          .json({ error: "Unauthorized access profile token flag." });
        return;
      }

      // Calls service layer to get matching rows (Fallback empty array if none found)
      // If your service method is named slightly differently (e.g. getPropertiesByUserId), update it here.
      const properties =
        (await propertyService.getPropertiesByUserId?.(
          Number(sessionUserId),
        )) || [];

      res.status(200).json(properties);
    } catch (error: any) {
      console.error("❌ Controller Index Fetch Error:", error);
      res.status(500).json({
        error: "Failed to gather landlord summary array index points.",
        details: error.message,
      });
    }
  }

  // 3. NEW METHOD: Fetch deep floorplan layout structures (Rooms -> Beds nesting arrays)
  async getPropertyStructureDetails(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error:
            "Target structural inventory identifier string required parameter.",
        });
        return;
      }

      // Calls service layer to do deep recursive loading (Prisma include maps)
      // If your service method is named differently (e.g. getPropertyById), update it here.
      const deepPropertyDetails =
        (await propertyService.getPropertyWithStructureDetails?.(Number(id))) ||
        null;

      if (!deepPropertyDetails) {
        res.status(404).json({
          error: "No building structure found mapping to that parameter point.",
        });
        return;
      }

      res.status(200).json(deepPropertyDetails);
    } catch (error: any) {
      console.error("❌ Controller Sub-Grid Extraction Error:", error);
      res.status(500).json({
        error: "Failed to compile matrix nested structural tree lists.",
        details: error.message,
      });
    }
  }
}
