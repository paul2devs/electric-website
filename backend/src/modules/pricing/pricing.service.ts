import { Injectable, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class PricingService {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly config: ConfigService,
  ) {}

  async calculatePrice(input: {
    serviceId: string;
    date?: string;
    time?: string;
    address?: string;
    mockDistanceKm?: number;
    addOnIds?: string[];
  }): Promise<PricingResult> {
    const service = await this.servicesService.findById(input.serviceId);
    if (!service) {
      throw new NotFoundException("Service not found");
    }

    const base = this.round(service.basePrice);
    const urgency = this.round(this.calculateUrgencyFee(base, input.date, input.time));

    const distanceKm = input.mockDistanceKm ?? 0;
    const distance = this.round(this.calculateDistanceFee(distanceKm));

    const validAddOnIds = new Set(service.addOns.map((item) => item.id));
    const selectedAddOnIds = (input.addOnIds ?? []).filter((id) => validAddOnIds.has(id));
    const addOnsTotal = this.round(
      service.addOns
        .filter((item) => selectedAddOnIds.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0),
    );

    const total = this.round(base + urgency + distance + addOnsTotal);

    return {
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      addOnIds: selectedAddOnIds,
      distanceKm,
      breakdown: {
        base,
        urgency,
        distance,
        addons: addOnsTotal,
        total,
      },
    };
  }

  private calculateUrgencyFee(base: number, date?: string, time?: string): number {
    if (!date || !time) {
      return 0;
    }
    const target = new Date(`${date}T${time}:00.000Z`);
    if (Number.isNaN(target.getTime())) {
      return 0;
    }

    const now = new Date();
    const nowMs = now.getTime();
    const targetMs = target.getTime();
    if (targetMs <= nowMs) {
      return base * 0.3;
    }

    const targetDay = target.toISOString().slice(0, 10);
    const today = now.toISOString().slice(0, 10);
    if (targetDay === today) {
      return base * 0.3;
    }

    const diffHours = (targetMs - nowMs) / (1000 * 60 * 60);
    if (diffHours <= 24) {
      return base * 0.2;
    }

    return 0;
  }

  private calculateDistanceFee(distanceKm: number): number {
    const mid = this.config.get<number>("PRICING_DISTANCE_MID_FEE", 10);
    const far = this.config.get<number>("PRICING_DISTANCE_FAR_FEE", 20);

    if (distanceKm <= 5) {
      return 0;
    }
    if (distanceKm <= 15) {
      return mid;
    }
    return far;
  }

  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
