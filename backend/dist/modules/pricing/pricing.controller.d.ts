import { CalculatePricingDto } from "./dto/calculate-pricing.dto";
import { PricingService, type PricingResult } from "./pricing.service";
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    calculate(dto: CalculatePricingDto): Promise<PricingResult>;
}
