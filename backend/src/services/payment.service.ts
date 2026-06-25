import { PaymentRepository } from "../repositories/payment.repository.js";

const paymentRepo = new PaymentRepository();

export class PaymentService {
  async collectPayment(
    currentLandlordId: number,
    invoiceId: number,
    paymentMode: string,
  ) {
    // 1. Fetch targeted statement log with its underlying property relationships
    const invoice = await paymentRepo.findInvoiceWithContext(invoiceId);
    if (!invoice) {
      throw new Error("Target invoice record could not be found.");
    }

    // 2. Ownership Security Guard: Validate that the token user matches the property owner
    if (invoice.tenant.property.landlordId !== currentLandlordId) {
      throw new Error(
        "Authorization Denied: You do not have permission to log payments for this property.",
      );
    }

    // 3. State Guard: Ensure invoice hasn't been settled already
    if (invoice.paymentStatus === "Paid") {
      throw new Error("This statement has already been settled and paid.");
    }

    // 4. Validation Guard: Check supported payment methods
    const allowedModes = ["Cash", "UPI", "Bank_Transfer"];
    if (!allowedModes.includes(paymentMode)) {
      throw new Error(
        `Unsupported payment method: '${paymentMode}'. Must be one of ${allowedModes.join(", ")}`,
      );
    }

    // 5. Fire DB update event
    const paidAtTimestamp = new Date();
    const updatedInvoice = await paymentRepo.markInvoiceAsPaid(
      invoiceId,
      paymentMode,
      paidAtTimestamp,
    );

    // 6. Structure and return the detailed certified Receipt Object
    return {
      receiptNumber: `REC-${updatedInvoice.id}-${paidAtTimestamp.getFullYear()}`,
      propertyName: invoice.tenant.property.name,
      propertyAddress: invoice.tenant.property.address,
      tenantName: invoice.tenant.name,
      tenantPhone: invoice.tenant.phoneNumber,
      billingPeriod: {
        start: invoice.billingPeriodStart,
        end: invoice.billingPeriodEnd,
      },
      breakdown: {
        baseRent: invoice.baseRentCharged,
        electricityTotal: invoice.electricityTotal,
        additionalCharges: invoice.additionalCharges,
      },
      totalAmountPaid: invoice.totalAmountDue,
      paymentDetails: {
        mode: updatedInvoice.paymentMode,
        timestamp: updatedInvoice.paidAt,
      },
    };
  }
}
