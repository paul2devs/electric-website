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
export declare class InvoicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listForUser(userId: string): Promise<InvoiceResponse[]>;
    getForUser(userId: string, invoiceId: string): Promise<InvoiceResponse>;
    private toResponse;
}
