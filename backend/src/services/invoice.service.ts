import { InvoiceRepository } from "../repositories/invoice.repository.js";

const invoiceRepo = new InvoiceRepository();

export class InvoiceService {
  async generateMonthlyStatement(
    currentLandlordId: number, // Added ownership context parameter
    payload: {
      tenantId: number;
      currentMeterReading: number;
      electricityRatePerUnit: number;
      additionalCharges: number;
    },
  ) {
    const tenantSpecs = await invoiceRepo.getTenantBillingSpecs(
      payload.tenantId,
    );

    if (!tenantSpecs || tenantSpecs.status !== "Active") {
      throw new Error(
        "Target tenant record is either inactive or does not exist.",
      );
    }

    // Ownership Guard: Block landlords from billing tenants that don't belong to their property
    if (tenantSpecs.property.landlordId !== currentLandlordId) {
      throw new Error(
        "Authorization Denied: You do not have permission to manage billing for this tenant.",
      );
    }

    if (!tenantSpecs.bed?.room) {
      throw new Error(
        "This tenant is not currently allocated to an active room inventory slot.",
      );
    }

    const room = tenantSpecs.bed.room;
    const baseRent = Number(room.baseRent);
    const previousReading = Number(room.latestMeterReading);

    const powerUnitsConsumed = payload.currentMeterReading - previousReading;
    if (powerUnitsConsumed < 0) {
      throw new Error(
        `Invalid Input: Current reading (${payload.currentMeterReading}) cannot be less than the last entry baseline (${previousReading}).`,
      );
    }

    const powerCostTotal = powerUnitsConsumed * payload.electricityRatePerUnit;
    const grossTotalDue = baseRent + powerCostTotal + payload.additionalCharges;

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return await invoiceRepo.createInvoiceAndUpdateMeter(
      room.id,
      payload.currentMeterReading,
      {
        tenantId: payload.tenantId,
        billingPeriodStart: oneMonthAgo,
        billingPeriodEnd: today,
        baseRentCharged: baseRent,
        previousMeterReading: previousReading,
        currentMeterReading: payload.currentMeterReading,
        electricityRatePerUnit: payload.electricityRatePerUnit,
        electricityTotal: powerCostTotal,
        additionalCharges: payload.additionalCharges,
        totalAmountDue: grossTotalDue,
      },
    );
  }

  async fetchHistory(currentLandlordId: number, tenantId: number) {
    const tenantSpecs = await invoiceRepo.getTenantBillingSpecs(tenantId);
    if (!tenantSpecs || tenantSpecs.property.landlordId !== currentLandlordId) {
      throw new Error(
        "Authorization Denied: Cannot access ledger details for this profile.",
      );
    }
    return await invoiceRepo.getTenantInvoices(tenantId);
  }
}
