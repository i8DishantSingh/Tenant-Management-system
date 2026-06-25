import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js"; // Use your extended request type
import { InvoiceService } from "../services/invoice.service.js";

const invoiceService = new InvoiceService();

export class InvoiceController {
  async processNewBillingCycle(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const landlordId = req.userId; // Injected securely from your verified JWT
      if (!landlordId) {
        res.status(401).json({ error: "Unauthorized access credentials." });
        return;
      }

      const {
        tenantId,
        currentMeterReading,
        electricityRatePerUnit,
        additionalCharges,
      } = req.body;

      if (
        !tenantId ||
        currentMeterReading === undefined ||
        !electricityRatePerUnit
      ) {
        res
          .status(400)
          .json({ error: "Missing essential billing metrics parameters." });
        return;
      }

      // Pass landlordId down as the security baseline checker parameter
      const invoice = await invoiceService.generateMonthlyStatement(
        landlordId,
        {
          tenantId: Number(tenantId),
          currentMeterReading: Number(currentMeterReading),
          electricityRatePerUnit: Number(electricityRatePerUnit),
          additionalCharges: additionalCharges ? Number(additionalCharges) : 0,
        },
      );

      res.status(201).json({
        message:
          "Monthly statement generated successfully under verified session!",
        invoiceSummary: invoice,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStatementHistory(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const landlordId = req.userId;
      if (!landlordId) {
        res.status(401).json({ error: "Unauthorized access credentials." });
        return;
      }

      const { tenantId } = req.params;
      const history = await invoiceService.fetchHistory(
        landlordId,
        Number(tenantId),
      );
      res.status(200).json({ count: history.length, ledger: history });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
