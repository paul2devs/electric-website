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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../auth/guards/admin.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_technician_dto_1 = require("../technicians/dto/create-technician.dto");
const update_technician_dto_1 = require("../technicians/dto/update-technician.dto");
const technicians_service_1 = require("../technicians/technicians.service");
const client_1 = require("@prisma/client");
const update_feedback_status_dto_1 = require("../feedback/dto/update-feedback-status.dto");
const feedback_service_1 = require("../feedback/feedback.service");
const admin_assign_technician_dto_1 = require("./dto/admin-assign-technician.dto");
const admin_service_upsert_dto_1 = require("./dto/admin-service-upsert.dto");
const admin_update_booking_dto_1 = require("./dto/admin-update-booking.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    adminService;
    techniciansService;
    feedbackService;
    constructor(adminService, techniciansService, feedbackService) {
        this.adminService = adminService;
        this.techniciansService = techniciansService;
        this.feedbackService = feedbackService;
    }
    async overview() {
        return this.adminService.overview();
    }
    async bookings() {
        return this.adminService.listBookings();
    }
    async bookingDetail(id) {
        return this.adminService.getBooking(id);
    }
    async updateBooking(id, dto) {
        return this.adminService.updateBooking(id, dto);
    }
    async assignTechnician(dto) {
        return this.adminService.assignTechnician(dto);
    }
    async services() {
        return this.adminService.listServices();
    }
    async createService(dto) {
        return this.adminService.createService(dto);
    }
    async updateService(id, dto) {
        return this.adminService.updateService(id, dto);
    }
    async deleteService(id) {
        await this.adminService.deleteService(id);
    }
    async users() {
        return this.adminService.listUsers();
    }
    async blockUser(id, block) {
        return this.adminService.blockUser(id, block === "true");
    }
    async technicians() {
        return this.techniciansService.list();
    }
    async createTechnician(dto) {
        return this.techniciansService.create(dto);
    }
    async updateTechnician(id, dto) {
        return this.techniciansService.update(id, dto);
    }
    async analytics() {
        return this.adminService.analytics();
    }
    async feedback(status) {
        return this.feedbackService.listForAdmin(status);
    }
    async updateFeedbackStatus(id, dto) {
        return this.feedbackService.updateStatus(id, dto.status);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("bookings"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bookings", null);
__decorate([
    (0, common_1.Get)("bookings/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bookingDetail", null);
__decorate([
    (0, common_1.Patch)("bookings/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_update_booking_dto_1.AdminUpdateBookingDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.Post)("assign-technician"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_assign_technician_dto_1.AdminAssignTechnicianDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignTechnician", null);
__decorate([
    (0, common_1.Get)("services"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "services", null);
__decorate([
    (0, common_1.Post)("services"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_service_upsert_dto_1.AdminServiceUpsertDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createService", null);
__decorate([
    (0, common_1.Patch)("services/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_service_upsert_dto_1.AdminServiceUpsertDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateService", null);
__decorate([
    (0, common_1.Delete)("services/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteService", null);
__decorate([
    (0, common_1.Get)("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Patch)("users/:id/block"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("block")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Get)("technicians"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "technicians", null);
__decorate([
    (0, common_1.Post)("technicians"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_technician_dto_1.CreateTechnicianDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createTechnician", null);
__decorate([
    (0, common_1.Patch)("technicians/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_technician_dto_1.UpdateTechnicianDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateTechnician", null);
__decorate([
    (0, common_1.Get)("analytics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "analytics", null);
__decorate([
    (0, common_1.Get)("feedback"),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "feedback", null);
__decorate([
    (0, common_1.Patch)("feedback/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_feedback_status_dto_1.UpdateFeedbackStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateFeedbackStatus", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        technicians_service_1.TechniciansService,
        feedback_service_1.FeedbackService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map