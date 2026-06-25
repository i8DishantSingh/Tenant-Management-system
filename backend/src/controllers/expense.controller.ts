import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { ExpenseService } from "../services/expense.service.js";

const expenseService = new ExpenseService();

export class ExpenseController {
  async addNewExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const landlordId = req.userId;
      if (!landlordId) {
        res.status(401).json({ error: "Unauthorized session context." });
        return;
      }

      const { propertyId, title, category, amount, notes } = req.body;
      if (!propertyId || !title || !category || !amount) {
        res.status(400).json({ error: "Missing required expense fields." });
        return;
      }

      const expense = await expenseService.logNewCost(landlordId, {
        propertyId: Number(propertyId),
        title,
        category,
        amount: Number(amount),
        notes,
      });

      res
        .status(201)
        .json({ message: "Expense logged successfully!", expense });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProfitSummary(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const landlordId = req.userId;
      if (!landlordId) {
        res.status(401).json({ error: "Unauthorized session context." });
        return;
      }

      const { propertyId } = req.params;
      const dashboard = await expenseService.compileMonthlyDashboard(
        landlordId,
        Number(propertyId),
      );

      res.status(200).json({ dashboard });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
