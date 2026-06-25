import { TenantApplicationRepository } from "../repositories/tenantApplication.repository.js";

const applicationRepo = new TenantApplicationRepository();

export class TenantApplicationService {
  // Public intake processing pipeline
  async submitForm(payload: {
    propertyId: number;
    roomId?: number;
    bedId?: number;
    name: string;
    phoneNumber: string;
    emergencyContact?: string;
    idProofUrl?: string;
    proposedJoinDate: string;
  }) {
    return await applicationRepo.createApplication({
      ...payload,
      proposedJoinDate: new Date(payload.proposedJoinDate),
    });
  }

  // Fetch dashboard lists for landlords
  async listPropertyApplications(propertyId: number) {
    return await applicationRepo.getPendingApplicationsByProperty(propertyId);
  }

  // Process the decision pipeline
  async processApproval(applicationId: number, manualBedId?: number) {
    const app = await applicationRepo.findApplicationById(applicationId);
    if (!app) throw new Error("Application record not found.");
    if (app.status !== "Pending")
      throw new Error("This application has already been processed.");

    // Determine target assignment allocation slot
    let targetBedId = manualBedId || app.bedId;

    // If the applicant only chose a room type, dynamically pick the first open bed slot
    if (!targetBedId && app.roomId) {
      const availableBed = await applicationRepo.findFirstAvailableBed(
        app.roomId,
      );
      if (!availableBed)
        throw new Error(
          "No vacant beds remaining inside the selected target room.",
        );
      targetBedId = availableBed.id;
    }

    if (!targetBedId) {
      throw new Error(
        "Cannot approve application without allocating a specific Bed ID allocation slot.",
      );
    }

    // Fire transaction lifecycle block
    return await applicationRepo.approveApplicationTransaction(
      applicationId,
      targetBedId,
      app.proposedJoinDate,
    );
  }

  async processRejection(applicationId: number) {
    return await applicationRepo.rejectApplication(applicationId);
  }
}
