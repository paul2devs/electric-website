import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

export type InvoiceResponse = {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: "unpaid" | "paid" | "void";
  issuedAt: string;
  booking: {
    id: string;
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    pricing: {
      base: number;
      urgency: number;
      distance: number;
      addons: number;
      total: number;
    };
  };
};

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string): Promise<InvoiceResponse[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: { userId },
      include: { booking: { include: { service: true } } },
      orderBy: { issuedAt: "desc" },
    });
    return invoices.map((invoice) => this.toResponse(invoice));
  }

  async getForUser(userId: string, invoiceId: string): Promise<InvoiceResponse> {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
      include: { booking: { include: { service: true } } },
    });
    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }
    return this.toResponse(invoice);
  }

  private toResponse(
    invoice: Awaited<ReturnType<PrismaService["invoice"]["findFirst"]>> & {
      booking: {
        id: string;
        serviceId: string;
        date: Date;
        time: string;
        baseAmount: number;
        urgencyFee: number;
        distanceFee: number;
        addonsFee: number;
        price: number;
        service: { name: string };
      };
    },
  ): InvoiceResponse {
    return {
      id: invoice.id,
      bookingId: invoice.bookingId,
      userId: invoice.userId,
      amount: invoice.amount,
      status: invoice.status,
      issuedAt: invoice.issuedAt.toISOString(),
      booking: {
        id: invoice.booking.id,
        serviceId: invoice.booking.serviceId,
        serviceName: invoice.booking.service.name,
        date: invoice.booking.date.toISOString().slice(0, 10),
        time: invoice.booking.time,
        pricing: {
          base: invoice.booking.baseAmount,
          urgency: invoice.booking.urgencyFee,
          distance: invoice.booking.distanceFee,
          addons: invoice.booking.addonsFee,
          total: invoice.booking.price,
        },
      },
    };
  }
}
