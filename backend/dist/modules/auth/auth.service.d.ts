import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailService } from "../notifications/email/email.service";
import { UsersService, type SafeUser } from "../users/users.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly config;
    private readonly prisma;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService, prisma: PrismaService, emailService: EmailService);
    register(dto: RegisterDto): Promise<{
        user: SafeUser;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: SafeUser;
    }>;
    refresh(refreshToken: string | undefined): Promise<{
        accessToken: string;
    }>;
    signAccess(user: SafeUser): string;
    private signRefresh;
    forgotPassword(dto: ForgotPasswordDto): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    private hashResetToken;
    private getRefreshSecret;
}
