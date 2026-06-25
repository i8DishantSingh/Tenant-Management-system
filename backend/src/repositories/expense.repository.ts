import { prisma } from "../config/db.js";

export class ExpenseRepository {
  // Log a new property outflow entry
  async createExpense(data: {
    propertyId: number;
    title: string;
    category: string;
    amount: number;
    notes?: string;
  }) {
    return await prisma.expense.create({
      data: {
        propertyId: data.propertyId,
        title: data.title,
        category: data.category,
        amount: data.amount,
        notes: data.notes,
      },
    });
  }

  // Fetch the contextual property ownership details
  async getPropertyOwner(propertyId: number) {
    return await prisma.property.findUnique({
      where: { id: propertyId },
      select: { landlordId: true },
    });
  }

  // Calculate total paid revenues and expenses for a given month
  async getMonthlyFinancials(
    propertyId: number,
    startOfMonth: Date,
    endOfMonth: Date,
  ) {
    // 1. Calculate sum of all settled invoices within the monthly window
    const revenueAggregation = await prisma.invoice.aggregate({
      where: {
        tenant: { propertyId },
        paymentStatus: "Paid",
        paidAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { totalAmountDue: true },
    });

    // 2. Calculate sum of all logged expense receipts within the same window
    const expenseAggregation = await prisma.expense.aggregate({
      where: {
        propertyId,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    });

    return {
      totalRevenue: Number(revenueAggregation._sum.totalAmountDue || 0),
      totalExpenses: Number(expenseAggregation._sum.amount || 0),
    };
  }
}
