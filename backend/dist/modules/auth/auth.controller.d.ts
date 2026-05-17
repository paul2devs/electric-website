import type { Request, Response } from "express";
import type { SafeUser } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import type { AuthRequest } from "./interfaces/auth-request.interface";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: SafeUser;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        accessToken: string;
        user: SafeUser;
    }>;
    refresh(req: Request): Promise<{
        accessToken: string;
    }>;
    logout(res: Response): void;
    me(req: AuthRequest): SafeUser;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
