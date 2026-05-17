import type { AddOn, Service } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
export type ServiceWithAddOns = Service & {
    addOns: AddOn[];
};
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<ServiceWithAddOns[]>;
    findById(serviceId: string): Promise<ServiceWithAddOns | null>;
}
