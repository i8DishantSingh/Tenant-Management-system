import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js"; // Import our auth guard

const router = Router();
const controller = new PaymentController();

// Apply requireAuth middleware to lock down the settlement endpoint completely
router.patch(
  "/invoice/:invoiceId/settle",
  requireAuth,
  controller.processInvoiceSettlement,
);

export default router;
