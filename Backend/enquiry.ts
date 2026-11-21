import { randomUUID } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { EnquiryDetails, Product } from "./contracts.ts";

export interface EmailService {
  sendEnquiry(details: EnquiryDetails, product: Product): Promise<void>;
}

export function parseEnquiry(value: unknown): EnquiryDetails | null {
  if (!value || typeof value !== "object") return null;
  const { productId, name, email, message } = value as Partial<EnquiryDetails>;
  if (typeof productId !== "number" || !Number.isSafeInteger(productId) || productId < 1 ||
    typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return null;
  }
  const details = { productId, name: name.trim(), email: email.trim(), message: message.trim() };
  if (!details.name || details.name.length > 100 ||
    details.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email) ||
    !details.message || details.message.length > 2000) {
    return null;
  }
  return details;
}

export class FileEmailService implements EmailService {
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  async sendEnquiry(details: EnquiryDetails, product: Product): Promise<void> {
    const id = randomUUID();
    const message = [
      `Product: ${product.title} (#${product.id})`,
      `Name: ${details.name}`,
      `Email: ${details.email}`,
      "",
      details.message,
    ].join("\r\n");
    const encoded = Buffer.from(message).toString("base64").match(/.{1,76}/g)?.join("\r\n");
    // kept the emails with testing email addresses to avoid sending real emails during testing. In a production environment, you would replace these with actual email addresses.
    const email = [
      "From: catalogue@example.test",
      "To: sales@example.test",
      `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
      `Message-ID: <${id}@example.test>`,
      "Subject: Product enquiry",
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      encoded,
      "",
    ].join("\r\n");

    // Publish the message atomically so the inbox contains only completed .eml files. and used inbuilt node packages to wite and rename
    await mkdir(this.directory, { recursive: true });
    const temporary = join(this.directory, `.${id}.tmp`);
    await writeFile(temporary, email, { flag: "wx", mode: 0o600 });
    await rename(temporary, join(this.directory, `${id}.eml`));
  }
}
