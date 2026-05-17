import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof PrismaClientKnownRequestError) {
      const { status, message } = this.mapPrismaKnown(exception);
      this.logger.warn(
        `Prisma ${exception.code}: ${exception.message?.slice(0, 200)}`,
      );
      response.status(status).json({
        success: false,
        message,
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof PrismaClientInitializationError) {
      this.logger.error(exception.message);
      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message:
          "Database connection failed. Check DATABASE_URL and that PostgreSQL is reachable.",
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const raw =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const message = this.resolveMessage(status, raw);

    const payload: Record<string, unknown> = {
      success: false,
      message,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (
      process.env.NODE_ENV !== "production" &&
      !(exception instanceof HttpException) &&
      exception instanceof Error
    ) {
      payload.debug = {
        name: exception.name,
        message: exception.message,
      };
    }

    response.status(status).json(payload);
  }

  private mapPrismaKnown(
    exception: PrismaClientKnownRequestError,
  ): { status: number; message: string } {
    if (exception.code === "P2002") {
      return {
        status: HttpStatus.CONFLICT,
        message: "An account with this email already exists",
      };
    }
    if (exception.code === "P1003") {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message:
          "Database does not exist or is unreachable. Create the database and run migrations.",
      };
    }
    if (
      exception.code === "P1001" ||
      exception.code === "P1000" ||
      exception.code === "P1017"
    ) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message:
          "Cannot reach the database server. Verify DATABASE_URL and network access.",
      };
    }
    if (
      exception.code === "P2022" ||
      exception.code === "P2010" ||
      exception.code === "P2021"
    ) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message:
          "Database schema does not match the application. Run Prisma migrations against this database (backend: npm run db:deploy).",
      };
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Something went wrong. Please try again.",
    };
  }

  private resolveMessage(status: number, raw: unknown): string {
    if (status >= 500) {
      return "Something went wrong. Please try again.";
    }
    if (typeof raw === "string" && raw.trim()) {
      return raw;
    }
    if (raw && typeof raw === "object" && "message" in raw) {
      const msg = (raw as { message?: string | string[] }).message;
      if (typeof msg === "string" && msg.trim()) {
        return msg;
      }
      if (Array.isArray(msg) && msg.length > 0) {
        return msg.join(", ");
      }
    }
    return "Request failed";
  }
}
