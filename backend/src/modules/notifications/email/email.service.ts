import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

import type { NotificationEmail } from "./email.types";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: "smtp" | "resend" | "sendgrid";

  constructor(private readonly config: ConfigService) {
    this.provider =
      (config.get<string>("EMAIL_PROVIDER")?.toLowerCase() as "smtp" | "resend" | "sendgrid") ||
      "smtp";
  }

  async send(message: NotificationEmail): Promise<void> {
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

  private async sendWithSmtp(message: NotificationEmail): Promise<void> {
    const host = this.config.get<string>("SMTP_HOST");
    const port = this.config.get<number>("SMTP_PORT") ?? 587;
    const user = this.config.get<string>("SMTP_USER");
    const pass = this.config.get<string>("SMTP_PASS");
    const from = this.config.get<string>("EMAIL_FROM");

    if (!host || !user || !pass || !from) {
      this.logger.warn("SMTP not configured. Skipping email delivery.");
      return;
    }

    const transporter = nodemailer.createTransport({
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

  private async sendWithResend(message: NotificationEmail): Promise<void> {
    const key = this.config.get<string>("RESEND_API_KEY");
    const from = this.config.get<string>("EMAIL_FROM");
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

  private async sendWithSendGrid(message: NotificationEmail): Promise<void> {
    const key = this.config.get<string>("SENDGRID_API_KEY");
    const from = this.config.get<string>("EMAIL_FROM");
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
}
