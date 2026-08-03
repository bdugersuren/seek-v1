import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

interface RateLimitBucket {
  count: number;
  resetsAt: number;
}

@Injectable()
export class RateLimitService {
  private readonly buckets = new Map<string, RateLimitBucket>();

  assertAllowed(
    scope: string,
    identity: string,
    limit = parseInt(process.env.AUTH_RATE_LIMIT_MAX || "10", 10),
    windowMs = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "900000", 10),
  ): void {
    const now = Date.now();
    const key = `${scope}:${identity}`;
    const current = this.buckets.get(key);

    if (!current || current.resetsAt <= now) {
      this.buckets.set(key, {
        count: 1,
        resetsAt: now + windowMs,
      });
      return;
    }

    current.count += 1;
    if (current.count > limit) {
      throw new HttpException(
        "Хэт олон удаа оролдлоо. Түр хүлээгээд дахин оролдоно уу.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
