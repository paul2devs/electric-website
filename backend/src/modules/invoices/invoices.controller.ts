import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { InvoicesService, type InvoiceResponse } from "./invoices.service";

@Controller("invoices")
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async list(@Req() req: AuthRequest): Promise<InvoiceResponse[]> {
    return this.invoicesService.listForUser(req.user.id);
  }

  @Get(":id")
  async detail(
    @Req() req: AuthRequest,
    @Param("id") id: string,
  ): Promise<InvoiceResponse> {
    return this.invoicesService.getForUser(req.user.id, id);
  }
}
