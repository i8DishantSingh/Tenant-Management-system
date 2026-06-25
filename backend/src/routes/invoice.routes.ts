import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js"; // Import your auth guard

const router = Router();
const controller = new InvoiceController();

// Apply requireAuth middleware explicitly to protect these operational paths
router.post("/calculate-bill", requireAuth, controller.processNewBillingCycle);
router.get(
  "/tenant/:tenantId/history",
  requireAuth,
  controller.getStatementHistory,
);

export default router;
