import { Router } from "express";
import { TenantApplicationController } from "../controllers/tenantApplication.controller.js";

const router = Router();
const controller = new TenantApplicationController();

// =========================================================================
// Public Routes (No auth context required)
// =========================================================================

// CHANGED: Restored path to '/submit' to match your frontend PublicApply.tsx fetch request path exactly
router.post("/submit", controller.submitApplicationForm);

// FIXED: Changed 'tenantApplicationController' to use your active variable name 'controller'
router.get(
  "/properties/:propertyId/vacant",
  controller.getPublicPropertyVacancy,
);

// =========================================================================
// Landlord Administrative Management Routes (Protected by auth hooks in app.ts)
// =========================================================================
router.get("/property/:propertyId/pending", controller.getPropertyDashboard);
router.patch("/:applicationId/approve", controller.approveApplication);
router.patch("/:applicationId/reject", controller.rejectApplication);

export default router;
