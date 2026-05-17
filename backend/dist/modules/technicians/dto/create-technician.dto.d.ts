import { TechnicianStatus } from "@prisma/client";
export declare class CreateTechnicianDto {
    name: string;
    phone: string;
    skills: string[];
    status: TechnicianStatus;
}
