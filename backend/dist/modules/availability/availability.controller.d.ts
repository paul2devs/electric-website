import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { GetAvailabilityDto } from "./dto/get-availability.dto";
import { LockSlotDto } from "./dto/lock-slot.dto";
import { UnlockSlotDto } from "./dto/unlock-slot.dto";
import { AvailabilityService } from "./availability.service";
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    list(query: GetAvailabilityDto): Promise<{
        slots: string[];
    }>;
    lock(body: LockSlotDto, req: AuthRequest): Promise<{
        lockToken: string;
        expiresInSeconds: number;
    }>;
    unlock(body: UnlockSlotDto): Promise<void>;
}
