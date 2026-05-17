import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService, type SafeUser } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    profile(req: AuthRequest): SafeUser;
    updateProfile(req: AuthRequest, dto: UpdateProfileDto): Promise<SafeUser>;
    updatePassword(req: AuthRequest, dto: UpdatePasswordDto): Promise<void>;
}
