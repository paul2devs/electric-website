import type { Technician } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTechnicianDto } from "./dto/create-technician.dto";
import { UpdateTechnicianDto } from "./dto/update-technician.dto";
export type TechnicianWithStats = Technician & {
    activeJobs: number;
};
export declare class TechniciansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<TechnicianWithStats[]>;
    create(dto: CreateTechnicianDto): Promise<Technician>;
    update(id: string, dto: UpdateTechnicianDto): Promise<Technician>;
}
