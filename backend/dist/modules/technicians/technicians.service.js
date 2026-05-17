"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechniciansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TechniciansService = class TechniciansService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        const technicians = await this.prisma.technician.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                bookings: {
                    select: { id: true },
                    where: { status: { in: ["assigned", "in_progress"] } },
                },
            },
        });
        return technicians.map((tech) => ({
            id: tech.id,
            name: tech.name,
            phone: tech.phone,
            skills: tech.skills,
            status: tech.status,
            createdAt: tech.createdAt,
            activeJobs: tech.bookings.length,
        }));
    }
    async create(dto) {
        return this.prisma.technician.create({
            data: {
                name: dto.name.trim(),
                phone: dto.phone.trim(),
                skills: dto.skills.map((skill) => skill.trim()).filter(Boolean),
                status: dto.status,
            },
        });
    }
    async update(id, dto) {
        const existing = await this.prisma.technician.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException("Technician not found");
        }
        return this.prisma.technician.update({
            where: { id },
            data: {
                ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
                ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
                ...(dto.skills !== undefined
                    ? { skills: dto.skills.map((skill) => skill.trim()).filter(Boolean) }
                    : {}),
                ...(dto.status !== undefined ? { status: dto.status } : {}),
            },
        });
    }
};
exports.TechniciansService = TechniciansService;
exports.TechniciansService = TechniciansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TechniciansService);
//# sourceMappingURL=technicians.service.js.map