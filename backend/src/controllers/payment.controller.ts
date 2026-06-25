import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js"; // Use your custom typing wrapper
import { PaymentService } from "../services/payment.service.js";

const paymentService = new PaymentService();

export class PaymentController {
  async processInvoiceSettlement(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      // Extract the landlord ID from the decrypted JWT payload injection
      const landlordId = req.userId;
      if (!landlordId) {
        res.status(401).json({ error: "Unauthorized access credentials." });
        return;
      }

      const { invoiceId } = req.params;
      const { paymentMode } = req.body || {}; // Safe fallback object to handle blank body calls

      if (!paymentMode) {
        res
          .status(400)
          .json({ error: "Missing required 'paymentMode' parameter payload." });
        return;
      }

      // Forward the verified landlord identity metric to the validation service engine
      const receipt = await paymentService.collectPayment(
        landlordId,
        Number(invoiceId),
        paymentMode,
      );

      res.status(200).json({
        message:
          "Payment successfully captured and logged under secure session!",
        receipt: receipt,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
