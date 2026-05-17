import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { InvoicesService, type InvoiceResponse } from "./invoices.service";
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    list(req: AuthRequest): Promise<InvoiceResponse[]>;
    detail(req: AuthRequest, id: string): Promise<InvoiceResponse>;
}
