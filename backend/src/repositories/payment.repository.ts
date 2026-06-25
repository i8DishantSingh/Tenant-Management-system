import { prisma } from "../config/db.js";

export class PaymentRepository {
  // Locate an invoice along with details about the tenant and property (perfect for receipt generation)
  async findInvoiceWithContext(invoiceId: number) {
    return await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        tenant: {
          include: {
            property: true,
          },
        },
      },
    });
  }

  // Record the transaction settlement
  async markInvoiceAsPaid(
    invoiceId: number,
    paymentMode: string,
    paidAt: Date,
  ) {
    return await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paymentStatus: "Paid",
        paymentMode: paymentMode,
        paidAt: paidAt,
      },
      include: {
        tenant: true,
      },
    });
  }
}
