import type { User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
export type SafeUser = Omit<User, "password" | "isBlocked">;
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    toSafeUser(user: User): SafeUser;
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
        phone: string;
    }): Promise<SafeUser>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<SafeUser>;
    updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void>;
}
