import { FeedbackStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
type AuthUser = {
    id: string;
};
export declare class FeedbackService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFeedbackDto, authUser: AuthUser | null): Promise<{
        name: string | null;
        message: string;
        id: string;
        email: string | null;
        createdAt: Date;
        userId: string | null;
        status: import(".prisma/client").$Enums.FeedbackStatus;
    }>;
    listForAdmin(status?: FeedbackStatus): Promise<({
        user: {
            name: string;
            phone: string | null;
            id: string;
            email: string;
        } | null;
    } & {
        name: string | null;
        message: string;
        id: string;
        email: string | null;
        createdAt: Date;
        userId: string | null;
        status: import(".prisma/client").$Enums.FeedbackStatus;
    })[]>;
    updateStatus(id: string, status: FeedbackStatus): Promise<{
        name: string | null;
        message: string;
        id: string;
        email: string | null;
        createdAt: Date;
        userId: string | null;
        status: import(".prisma/client").$Enums.FeedbackStatus;
    }>;
}
export {};
