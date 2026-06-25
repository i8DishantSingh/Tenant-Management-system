import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new ExpenseController();

router.post("/log", requireAuth, controller.addNewExpense);
router.get(
  "/property/:propertyId/analytics",
  requireAuth,
  controller.getProfitSummary,
);

export default router;
