import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { CalculatePricingDto } from "./dto/calculate-pricing.dto";
import { PricingService, type PricingResult } from "./pricing.service";

@Controller("pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post("calculate")
  @HttpCode(HttpStatus.OK)
  async calculate(@Body() dto: CalculatePricingDto): Promise<PricingResult> {
    return this.pricingService.calculatePrice(dto);
  }
}
