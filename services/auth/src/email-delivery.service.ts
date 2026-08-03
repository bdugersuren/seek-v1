import { Injectable } from "@nestjs/common";
import * as net from "net";
import * as tls from "tls";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class EmailDeliveryService {
  async send(message: EmailMessage): Promise<void> {
    const deliveryMode = process.env.AUTH_EMAIL_DELIVERY_MODE;
    const shouldUseSmtp =
      deliveryMode === "smtp" ||
      (process.env.NODE_ENV === "production" && deliveryMode !== "log");

    if (!shouldUseSmtp || !process.env.SMTP_HOST) {
      this.logToDevOutbox(message);
      return;
    }

    await this.sendViaSmtp(message);
  }

  private logToDevOutbox(message: EmailMessage): void {
    console.log(
      [
        "[auth.email_outbox]",
        `to=${message.to}`,
        `subject=${JSON.stringify(message.subject)}`,
        `text=${JSON.stringify(message.text)}`,
      ].join(" "),
    );
  }

  private async sendViaSmtp(message: EmailMessage): Promise<void> {
    const host = requiredEnv("SMTP_HOST");
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.AUTH_EMAIL_FROM || user;
    const envelopeFrom = extractEmailAddress(from || "");

    if (!from || !envelopeFrom) {
      throw new Error("AUTH_EMAIL_FROM or SMTP_USER is required for SMTP email");
    }

    const client = new SmtpClient(host, port, secure);
    await client.connect();

    try {
      await client.expect(220);
      await client.command(`EHLO ${process.env.SMTP_HELO_DOMAIN || "seek.mn"}`, 250);

      if (!secure && process.env.SMTP_STARTTLS !== "false") {
        await client.command("STARTTLS", 220);
        client.upgradeToTls();
        await client.command(
          `EHLO ${process.env.SMTP_HELO_DOMAIN || "seek.mn"}`,
          250,
        );
      }

      if (user && password) {
        await client.command("AUTH LOGIN", 334);
        await client.command(Buffer.from(user).toString("base64"), 334);
        await client.command(Buffer.from(password).toString("base64"), 235);
      }

      await client.command(`MAIL FROM:<${envelopeFrom}>`, 250);
      await client.command(`RCPT TO:<${message.to}>`, [250, 251]);
      await client.command("DATA", 354);
      await client.writeData(formatMimeMessage(from, message));
      await client.expect(250);
      await client.command("QUIT", 221);
    } finally {
      client.close();
    }
  }
}

class SmtpClient {
  private socket: net.Socket | tls.TLSSocket | null = null;
  private buffer = "";

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly secure: boolean,
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const onError = (error: Error) => reject(error);
      const socket = this.secure
        ? tls.connect(this.port, this.host, { servername: this.host })
        : net.connect(this.port, this.host);

      socket.once("connect", () => {
        socket.off("error", onError);
        this.socket = socket;
        socket.on("data", (chunk) => {
          this.buffer += chunk.toString("utf8");
        });
        resolve();
      });
      socket.once("error", onError);
    });
  }

  upgradeToTls(): void {
    if (!this.socket) {
      throw new Error("SMTP socket is not connected");
    }

    this.socket = tls.connect({
      socket: this.socket,
      servername: this.host,
    });
    this.buffer = "";
    this.socket.on("data", (chunk) => {
      this.buffer += chunk.toString("utf8");
    });
  }

  async command(command: string, expected: number | number[]): Promise<string> {
    this.write(`${command}\r\n`);
    return this.expect(expected);
  }

  async writeData(data: string): Promise<void> {
    this.write(`${data}\r\n.\r\n`);
  }

  expect(expected: number | number[]): Promise<string> {
    const expectedCodes = Array.isArray(expected) ? expected : [expected];

    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
      const interval = setInterval(() => {
        const complete = parseSmtpResponse(this.buffer);
        if (!complete) {
          if (Date.now() - startedAt > 15000) {
            clearInterval(interval);
            reject(new Error("Timed out waiting for SMTP response"));
          }
          return;
        }

        clearInterval(interval);
        this.buffer = "";
        if (!expectedCodes.includes(complete.code)) {
          reject(
            new Error(
              `Unexpected SMTP response ${complete.code}: ${complete.response}`,
            ),
          );
          return;
        }
        resolve(complete.response);
      }, 25);
    });
  }

  close(): void {
    this.socket?.end();
    this.socket = null;
  }

  private write(data: string): void {
    if (!this.socket) {
      throw new Error("SMTP socket is not connected");
    }
    this.socket.write(data);
  }
}

function parseSmtpResponse(buffer: string): { code: number; response: string } | null {
  const lines = buffer.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return null;

  const last = lines[lines.length - 1];
  const match = last.match(/^(\d{3})(\s|-)/);
  if (!match || match[2] === "-") return null;

  return {
    code: parseInt(match[1], 10),
    response: lines.join("\n"),
  };
}

function formatMimeMessage(from: string, message: EmailMessage): string {
  const escapedText = dotStuff(message.text);
  const headers = [
    `From: ${from}`,
    `To: ${message.to}`,
    `Subject: ${encodeHeader(message.subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
  ];

  return `${headers.join("\r\n")}\r\n\r\n${escapedText}`;
}

function extractEmailAddress(value: string): string | null {
  const angleMatch = value.match(/<([^<>@\s]+@[^<>@\s]+)>/);
  if (angleMatch) return angleMatch[1];

  const trimmed = value.trim();
  return /^[^@\s]+@[^@\s]+$/.test(trimmed) ? trimmed : null;
}

function dotStuff(value: string): string {
  return value.replace(/^\./gm, "..");
}

function encodeHeader(value: string): string {
  return /^[\x00-\x7F]*$/.test(value)
    ? value
    : `=?UTF-8?B?${Buffer.from(value).toString("base64")}?=`;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}
