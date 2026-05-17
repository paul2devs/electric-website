"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const deployment_1 = require("../../config/deployment");
const prisma_service_1 = require("../../prisma/prisma.service");
const email_service_1 = require("../notifications/email/email.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    config;
    prisma;
    emailService;
    constructor(usersService, jwtService, config, prisma, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async register(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException("An account with this email already exists");
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.usersService.create({
            name: dto.name.trim(),
            email: dto.email,
            passwordHash,
            phone: dto.phone.trim(),
        });
        return { user };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || user.isBlocked) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        const safe = this.usersService.toSafeUser(user);
        const accessToken = this.signAccess(safe);
        const refreshToken = await this.signRefresh(safe);
        return { accessToken, refreshToken, user: safe };
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.getRefreshSecret(),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user || user.isBlocked) {
                throw new common_1.UnauthorizedException();
            }
            const safe = this.usersService.toSafeUser(user);
            return { accessToken: this.signAccess(safe) };
        }
        catch {
            throw new common_1.UnauthorizedException();
        }
    }
    signAccess(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    signRefresh(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.signAsync(payload, {
            secret: this.getRefreshSecret(),
            expiresIn: "7d",
        });
    }
    async forgotPassword(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || user.isBlocked) {
            return;
        }
        const token = (0, crypto_1.randomBytes)(32).toString("hex");
        const tokenHash = this.hashResetToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, tokenHash, expiresAt },
        });
        const resetLink = `${(0, deployment_1.getFrontendOrigin)()}/reset-password?token=${token}`;
        await this.emailService.send({
            to: user.email,
            subject: "Reset your Testimonydot password",
            html: `<p>You requested a password reset.</p><p>Use the link below to set a new password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`,
        });
    }
    async resetPassword(dto) {
        const tokenHash = this.hashResetToken(dto.token);
        const resetToken = await this.prisma.passwordResetToken.findFirst({
            where: {
                tokenHash,
                expiresAt: { gt: new Date() },
            },
        });
        if (!resetToken) {
            throw new common_1.BadRequestException("Invalid or expired reset token");
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: passwordHash },
            }),
            this.prisma.passwordResetToken.deleteMany({
                where: { userId: resetToken.userId },
            }),
        ]);
    }
    hashResetToken(token) {
        return (0, crypto_1.createHash)("sha256").update(token).digest("hex");
    }
    getRefreshSecret() {
        return (this.config.get("JWT_REFRESH_SECRET") ??
            this.config.getOrThrow("JWT_ACCESS_SECRET"));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map