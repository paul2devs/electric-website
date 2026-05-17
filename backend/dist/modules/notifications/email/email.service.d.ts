import { ConfigService } from "@nestjs/config";
import type { NotificationEmail } from "./email.types";
export declare class EmailService {
    private readonly config;
    private readonly logger;
    private readonly provider;
    constructor(config: ConfigService);
    send(message: NotificationEmail): Promise<void>;
    private sendWithSmtp;
    private sendWithResend;
    private sendWithSendGrid;
}
