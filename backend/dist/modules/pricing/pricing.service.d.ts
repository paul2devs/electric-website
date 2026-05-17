import { ConfigService } from "@nestjs/config";
import { ServicesService } from "../services/services.service";
export type PricingBreakdown = {
    base: number;
    urgency: number;
    distance: number;
    addons: number;
    total: number;
};
export type PricingResult = {
    serviceId: string;
    serviceName: string;
    serviceCategory: string;
    addOnIds: string[];
    distanceKm: number;
    breakdown: PricingBreakdown;
};
export declare class PricingService {
    private readonly servicesService;
    private readonly config;
    constructor(servicesService: ServicesService, config: ConfigService);
    calculatePrice(input: {
        serviceId: string;
        date?: string;
        time?: string;
        address?: string;
        mockDistanceKm?: number;
        addOnIds?: string[];
    }): Promise<PricingResult>;
    private calculateUrgencyFee;
    private calculateDistanceFee;
    private round;
}
