"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const services_service_1 = require("../services/services.service");
let PricingService = class PricingService {
    servicesService;
    config;
    constructor(servicesService, config) {
        this.servicesService = servicesService;
        this.config = config;
    }
    async calculatePrice(input) {
        const service = await this.servicesService.findById(input.serviceId);
        if (!service) {
            throw new common_1.NotFoundException("Service not found");
        }
        const base = this.round(service.basePrice);
        const urgency = this.round(this.calculateUrgencyFee(base, input.date, input.time));
        const distanceKm = input.mockDistanceKm ?? 0;
        const distance = this.round(this.calculateDistanceFee(distanceKm));
        const validAddOnIds = new Set(service.addOns.map((item) => item.id));
        const selectedAddOnIds = (input.addOnIds ?? []).filter((id) => validAddOnIds.has(id));
        const addOnsTotal = this.round(service.addOns
            .filter((item) => selectedAddOnIds.includes(item.id))
            .reduce((sum, item) => sum + item.price, 0));
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
    calculateUrgencyFee(base, date, time) {
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
    calculateDistanceFee(distanceKm) {
        const mid = this.config.get("PRICING_DISTANCE_MID_FEE", 10);
        const far = this.config.get("PRICING_DISTANCE_FAR_FEE", 20);
        if (distanceKm <= 5) {
            return 0;
        }
        if (distanceKm <= 15) {
            return mid;
        }
        return far;
    }
    round(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_service_1.ServicesService,
        config_1.ConfigService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map