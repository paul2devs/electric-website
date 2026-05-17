"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ApiExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
let ApiExceptionFilter = ApiExceptionFilter_1 = class ApiExceptionFilter {
    logger = new common_1.Logger(ApiExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (exception instanceof library_1.PrismaClientKnownRequestError) {
            const { status, message } = this.mapPrismaKnown(exception);
            this.logger.warn(`Prisma ${exception.code}: ${exception.message?.slice(0, 200)}`);
            response.status(status).json({
                success: false,
                message,
                statusCode: status,
                path: request.url,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        if (exception instanceof library_1.PrismaClientInitializationError) {
            this.logger.error(exception.message);
            response.status(common_1.HttpStatus.SERVICE_UNAVAILABLE).json({
                success: false,
                message: "Database connection failed. Check DATABASE_URL and that PostgreSQL is reachable.",
                statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                path: request.url,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (!(exception instanceof common_1.HttpException)) {
            this.logger.error(exception instanceof Error ? exception.stack : String(exception));
        }
        const raw = exception instanceof common_1.HttpException ? exception.getResponse() : undefined;
        const message = this.resolveMessage(status, raw);
        const payload = {
            success: false,
            message,
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
        };
        if (process.env.NODE_ENV !== "production" &&
            !(exception instanceof common_1.HttpException) &&
            exception instanceof Error) {
            payload.debug = {
                name: exception.name,
                message: exception.message,
            };
        }
        response.status(status).json(payload);
    }
    mapPrismaKnown(exception) {
        if (exception.code === "P2002") {
            return {
                status: common_1.HttpStatus.CONFLICT,
                message: "An account with this email already exists",
            };
        }
        if (exception.code === "P1003") {
            return {
                status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                message: "Database does not exist or is unreachable. Create the database and run migrations.",
            };
        }
        if (exception.code === "P1001" ||
            exception.code === "P1000" ||
            exception.code === "P1017") {
            return {
                status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                message: "Cannot reach the database server. Verify DATABASE_URL and network access.",
            };
        }
        if (exception.code === "P2022" ||
            exception.code === "P2010" ||
            exception.code === "P2021") {
            return {
                status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                message: "Database schema does not match the application. Run Prisma migrations against this database (backend: npm run db:deploy).",
            };
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Something went wrong. Please try again.",
        };
    }
    resolveMessage(status, raw) {
        if (status >= 500) {
            return "Something went wrong. Please try again.";
        }
        if (typeof raw === "string" && raw.trim()) {
            return raw;
        }
        if (raw && typeof raw === "object" && "message" in raw) {
            const msg = raw.message;
            if (typeof msg === "string" && msg.trim()) {
                return msg;
            }
            if (Array.isArray(msg) && msg.length > 0) {
                return msg.join(", ");
            }
        }
        return "Request failed";
    }
};
exports.ApiExceptionFilter = ApiExceptionFilter;
exports.ApiExceptionFilter = ApiExceptionFilter = ApiExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], ApiExceptionFilter);
//# sourceMappingURL=api-exception.filter.js.map