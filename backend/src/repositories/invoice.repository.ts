import { prisma } from "../config/db.js";

export class InvoiceRepository {
  async getTenantBillingSpecs(tenantId: number) {
    return await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        property: true, // Fetch property context to check ownership variables
        bed: {
          include: {
            room: true,
          },
        },
      },
    });
  }

  async createInvoiceAndUpdateMeter(
    roomId: number,
    currentReading: number,
    invoiceData: {
      tenantId: number;
      billingPeriodStart: Date;
      billingPeriodEnd: Date;
      baseRentCharged: number;
      previousMeterReading: number;
      currentMeterReading: number;
      electricityRatePerUnit: number;
      electricityTotal: number;
      additionalCharges: number;
      totalAmountDue: number;
    },
  ) {
    return await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({ data: invoiceData });

      await tx.room.update({
        where: { id: roomId },
        data: { latestMeterReading: currentReading },
      });

      return invoice;
    });
  }

  async getTenantInvoices(tenantId: number) {
    return await prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }
}
