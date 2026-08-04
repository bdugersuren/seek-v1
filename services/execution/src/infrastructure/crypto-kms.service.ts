import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class CryptoKMSService {
  private readonly kmsKey: Buffer;

  constructor() {
    const secret = process.env.KMS_SECRET || "seek_local_kms_secret_key_placeholder_safe_entropy_12345";
    this.kmsKey = crypto.createHash("sha256").update(secret).digest();
  }

  encrypt(text: string): { encryptedData: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", this.kmsKey, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag().toString("hex");
    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
      authTag,
    };
  }

  decrypt(encryptedData: string, ivHex: string, authTagHex: string): string {
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", this.kmsKey, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  generateSignature(message: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(message).digest("hex");
  }

  verifySignature(message: string, signature: string, secret: string): boolean {
    const expected = this.generateSignature(message, secret);
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expected, "hex")
      );
    } catch {
      return false;
    }
  }
}
