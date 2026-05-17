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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    config;
    logger = new common_1.Logger(EmailService_1.name);
    provider;
    constructor(config) {
        this.config = config;
        this.provider =
            config.get("EMAIL_PROVIDER")?.toLowerCase() ||
                "smtp";
    }
    async send(message) {
        if (this.provider === "resend") {
            await this.sendWithResend(message);
            return;
        }
        if (this.provider === "sendgrid") {
            await this.sendWithSendGrid(message);
            return;
        }
        await this.sendWithSmtp(message);
    }
    async sendWithSmtp(message) {
        const host = this.config.get("SMTP_HOST");
        const port = this.config.get("SMTP_PORT") ?? 587;
        const user = this.config.get("SMTP_USER");
        const pass = this.config.get("SMTP_PASS");
        const from = this.config.get("EMAIL_FROM");
        if (!host || !user || !pass || !from) {
            this.logger.warn("SMTP not configured. Skipping email delivery.");
            return;
        }
        const transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
        await transporter.sendMail({
            from,
            to: message.to,
            subject: message.subject,
            html: message.html,
        });
    }
    async sendWithResend(message) {
        const key = this.config.get("RESEND_API_KEY");
        const from = this.config.get("EMAIL_FROM");
        if (!key || !from) {
            this.logger.warn("Resend not configured. Skipping email delivery.");
            return;
        }
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ from, to: message.to, subject: message.subject, html: message.html }),
        });
        if (!res.ok) {
            const body = await res.text();
            this.logger.error(`Resend delivery failed: ${body}`);
        }
    }
    async sendWithSendGrid(message) {
        const key = this.config.get("SENDGRID_API_KEY");
        const from = this.config.get("EMAIL_FROM");
        if (!key || !from) {
            this.logger.warn("SendGrid not configured. Skipping email delivery.");
            return;
        }
        const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: { email: from },
                personalizations: [{ to: [{ email: message.to }] }],
                subject: message.subject,
                content: [{ type: "text/html", value: message.html }],
            }),
        });
        if (!res.ok) {
            const body = await res.text();
            this.logger.error(`SendGrid delivery failed: ${body}`);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map