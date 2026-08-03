import { HttpException, HttpStatus } from "@nestjs/common";
import { RateLimitService } from "./rate-limit.service";

describe("RateLimitService", () => {
  let service: RateLimitService;

  beforeEach(() => {
    service = new RateLimitService();
  });

  it("allows requests under the limit", () => {
    expect(() => {
      service.assertAllowed("login", "127.0.0.1:user@seek.mn", 2, 1000);
      service.assertAllowed("login", "127.0.0.1:user@seek.mn", 2, 1000);
    }).not.toThrow();
  });

  it("rejects requests over the limit", () => {
    service.assertAllowed("login", "127.0.0.1:user@seek.mn", 1, 1000);

    expect(() =>
      service.assertAllowed("login", "127.0.0.1:user@seek.mn", 1, 1000),
    ).toThrow(HttpException);
    try {
      service.assertAllowed("register", "127.0.0.1:new@seek.mn", 1, 1000);
      service.assertAllowed("register", "127.0.0.1:new@seek.mn", 1, 1000);
    } catch (error) {
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  });
});
