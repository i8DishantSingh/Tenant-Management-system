import { ExpenseRepository } from "../repositories/expense.repository.js";

const expenseRepo = new ExpenseRepository();

export class ExpenseService {
  // Log a new expense with strict authorization guards
  async logNewCost(
    currentLandlordId: number,
    data: {
      propertyId: number;
      title: string;
      category: string;
      amount: number;
      notes?: string;
    },
  ) {
    const property = await expenseRepo.getPropertyOwner(data.propertyId);
    if (!property) throw new Error("Property record not found.");
    if (property.landlordId !== currentLandlordId)
      throw new Error("Authorization Denied: You do not own this property.");

    return await expenseRepo.createExpense(data);
  }

  // Compile real-time P&L Statement for the current calendar month
  async compileMonthlyDashboard(currentLandlordId: number, propertyId: number) {
    const property = await expenseRepo.getPropertyOwner(propertyId);
    if (!property) throw new Error("Property record not found.");
    if (property.landlordId !== currentLandlordId)
      throw new Error("Authorization Denied: Access mismatch.");

    // Compute calendar month boundaries dynamically
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const metrics = await expenseRepo.getMonthlyFinancials(
      propertyId,
      startOfMonth,
      endOfMonth,
    );
    const netProfit = metrics.totalRevenue - metrics.totalExpenses;

    return {
      propertyId,
      timeframe: `${startOfMonth.toLocaleString("default", { month: "long" })} ${startOfMonth.getFullYear()}`,
      financials: {
        grossRevenue: metrics.totalRevenue,
        operationalExpenses: metrics.totalExpenses,
        netProfit: netProfit,
        profitMarginPercentage:
          metrics.totalRevenue > 0
            ? ((netProfit / metrics.totalRevenue) * 100).toFixed(2) + "%"
            : "0.00%",
      },
    };
  }
}
