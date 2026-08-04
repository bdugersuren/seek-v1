import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { CryptoKMSService } from "../crypto-kms.service";
import { AttemptStateStore } from "../../interfaces/state-store.interface";
import Redis from "ioredis";

@Injectable()
export class SignatureGuard implements CanActivate {
  private readonly memoryNonces = new Set<string>();

  constructor(
    private readonly cryptoKms: CryptoKMSService,
    @Inject("AttemptStateStore")
    private readonly stateStore: AttemptStateStore,
    @Inject("REDIS_CLIENT")
    private readonly redis: Redis | null
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    if (process.env.ENABLE_SIGNATURE_VERIFICATION === "false") {
      return true;
    }

    const signature = request.headers["x-request-signature"] as string;
    const nonce = request.headers["x-request-nonce"] as string;
    const timestampStr = request.headers["x-request-timestamp"] as string;
    const fingerprint = request.headers["x-device-fingerprint"] as string;

    if (!signature || !nonce || !timestampStr) {
      throw new UnauthorizedException("Missing signature headers (x-request-signature, x-request-nonce, x-request-timestamp)");
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    if (isNaN(timestamp) || Math.abs(now - timestamp) > 5 * 60 * 1000) {
      throw new ForbiddenException("Request timestamp clock skew is too large (must be within 5 minutes)");
    }

    const nonceKey = `nonce:${nonce}`;
    if (this.redis) {
      const exists = await this.redis.exists(nonceKey);
      if (exists) {
        throw new ForbiddenException("Duplicate request nonce (possible replay attack)");
      }
      await this.redis.set(nonceKey, "1", "EX", 300);
    } else {
      if (this.memoryNonces.has(nonce)) {
        throw new ForbiddenException("Duplicate request nonce (possible replay attack)");
      }
      this.memoryNonces.add(nonce);
      setTimeout(() => this.memoryNonces.delete(nonce), 5 * 60 * 1000);
    }

    const attemptId = request.params.attemptId || request.body.attemptId;
    if (!attemptId) {
      throw new UnauthorizedException("Missing attemptId in request parameters or body");
    }

    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new ForbiddenException(`Attempt session not found for id: ${attemptId}`);
    }

    const expectedFingerprint = (session as any).deviceFingerprintHash;
    if (expectedFingerprint && expectedFingerprint !== fingerprint) {
      throw new ForbiddenException("Device fingerprint mismatch. Spoofing attempt detected.");
    }

    let unlockKey = "";
    if (this.redis) {
      unlockKey = await this.redis.get(`unlock:${attemptId}`) || "";
    }
    if (!unlockKey) {
      unlockKey = `unlock-${attemptId}`;
    }

    const bodyStr = request.body ? JSON.stringify(request.body) : "";
    const message = `${timestampStr}.${nonce}.${bodyStr}`;

    const isValid = this.cryptoKms.verifySignature(message, signature, unlockKey);
    if (!isValid) {
      const systemSecret = process.env.SYSTEM_SIGNING_KEY || "seek_system_signing_key_secret_12345";
      const isSystemValid = this.cryptoKms.verifySignature(message, signature, systemSecret);
      if (!isSystemValid) {
        throw new ForbiddenException("Invalid request signature");
      }
    }

    return true;
  }
}
