import { Request, Response } from "express";
import { TenantApplicationService } from "../services/tenantApplication.service.js";
import { PropertyRepository } from "../repositories/property.repository.js"; // 1. Import your property repo

const appService = new TenantApplicationService();
const propertyRepo = new PropertyRepository(); // 2. Instantiate the repository instance

export class TenantApplicationController {
  // Public Endpoint: Tenant drops application payload
  async submitApplicationForm(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;

      // ✅ SAFEGUARD: Fallback calculation if proposedJoinDate is missing or empty
      if (
        !payload.proposedJoinDate ||
        isNaN(Date.parse(payload.proposedJoinDate))
      ) {
        payload.proposedJoinDate = new Date();
      } else {
        payload.proposedJoinDate = new Date(payload.proposedJoinDate);
      }

      const application = await appService.submitForm(payload);
      res.status(201).json({
        message:
          "Application submitted successfully! Your landlord will review it shortly.",
        applicationId: application.id,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Landlord Dashboard Endpoint: Get pending files
  async getPropertyDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { propertyId } = req.params;
      const list = await appService.listPropertyApplications(
        Number(propertyId),
      );
      res.status(200).json({ count: list.length, applications: list });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Landlord Action Endpoint: Accept application files
  async approveApplication(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const { bedId } = req.body || {};

      const result = await appService.processApproval(
        Number(applicationId),
        bedId ? Number(bedId) : undefined,
      );
      res.status(200).json({
        message:
          "Application approved successfully! Tenant record is now active.",
        tenant: result.newTenant,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Landlord Action Endpoint: Reject files
  async rejectApplication(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      await appService.processRejection(Number(applicationId));
      res
        .status(200)
        .json({ message: "Application has been successfully rejected." });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * NEW METHOD: Compiles a public, clean data manifest of available beds for intake forms
   * Route Hook: GET /api/applications/properties/:propertyId/vacant
   */
  async getPublicPropertyVacancy(req: Request, res: Response): Promise<void> {
    try {
      const { propertyId } = req.params;
      const parsedId = Number(propertyId);

      // 🛡️ ENHANCED GUARD: Catch undefined, null, OR NaN conversions
      if (!propertyId || isNaN(parsedId)) {
        res.status(400).json({
          error:
            "Property identification parameter context is required and must be a valid number.",
          received: propertyId, // This will tell you exactly what the router saw
        });
        return;
      }

      // Pass the safely parsed numeric ID
      const property =
        await propertyRepo.findPropertyWithStructureDetails(parsedId);

      if (!property) {
        res.status(404).json({
          error:
            "No matching housing facility found mapping to that resource key.",
        });
        return;
      }

      const vacantBeds: any[] = [];

      if (property && Array.isArray(property.rooms)) {
        property.rooms.forEach((room: any) => {
          if (Array.isArray(room.beds)) {
            room.beds.forEach((bed: any) => {
              if (!bed.isOccupied) {
                vacantBeds.push({
                  bedId: bed.id,
                  bedNumber: bed.bedNumber,
                  roomNumber: room.roomNumber,
                  roomId: room.id,
                  baseRent: room.baseRent,
                });
              }
            });
          }
        });
      }

      res.status(200).json({
        propertyName: property.name,
        vacantBeds: vacantBeds,
      });
    } catch (error: any) {
      console.error("❌ Controller Public Vacancy Compilation Error:", error);
      res.status(500).json({
        error:
          "An internal operational error blocked vacancy extraction workflows.",
        details: error.message,
      });
    }
  }
}
