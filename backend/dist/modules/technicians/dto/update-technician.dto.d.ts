import { TechnicianStatus } from "@prisma/client";
export declare class UpdateTechnicianDto {
    name?: string;
    phone?: string;
    skills?: string[];
    status?: TechnicianStatus;
}
