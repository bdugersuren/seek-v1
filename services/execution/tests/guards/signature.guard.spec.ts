import { SignatureGuard } from "../../src/infrastructure/guards/signature.guard";
import { CryptoKMSService } from "../../src/infrastructure/crypto-kms.service";
import { UnauthorizedException, ForbiddenException } from "@nestjs/common";

describe("SignatureGuard", () => {
  let guard: SignatureGuard;
  let cryptoKms: CryptoKMSService;
  let mockStateStore: any;
  let mockRedis: any;

  beforeEach(() => {
    cryptoKms = new CryptoKMSService();
    mockStateStore = {
      getSession: jest.fn(),
      hasIdempotencyKey: jest.fn(),
    };
    mockRedis = {
      exists: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
    };
    guard = new SignatureGuard(cryptoKms, mockStateStore, mockRedis);
  });

  const makeMockExecutionContext = (headers: Record<string, string>, body: any, params: any) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
          body,
          params,
        }),
      }),
    } as any;
  };

  it("throws UnauthorizedException if signature headers are missing", async () => {
    const context = makeMockExecutionContext({}, {}, {});
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it("throws ForbiddenException if clock skew is too large", async () => {
    const headers = {
      "x-request-signature": "sig",
      "x-request-nonce": "nonce-1",
      "x-request-timestamp": (Date.now() - 10 * 60 * 1000).toString(),
    };
    const context = makeMockExecutionContext(headers, {}, {});
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it("throws ForbiddenException on duplicate nonce (replay attack)", async () => {
    const headers = {
      "x-request-signature": "sig",
      "x-request-nonce": "nonce-1",
      "x-request-timestamp": Date.now().toString(),
    };
    mockRedis.exists.mockResolvedValueOnce(1);

    const context = makeMockExecutionContext(headers, { attemptId: "attempt-1" }, {});
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it("throws ForbiddenException if device fingerprint mismatches", async () => {
    const attemptId = "attempt-1";
    const fingerprint = "fingerprint-new";
    const headers = {
      "x-request-signature": "sig",
      "x-request-nonce": "nonce-1",
      "x-request-timestamp": Date.now().toString(),
      "x-device-fingerprint": fingerprint,
    };
    mockRedis.exists.mockResolvedValueOnce(0);
    mockStateStore.getSession.mockResolvedValueOnce({
      attemptId,
      deviceFingerprintHash: "fingerprint-original",
    });

    const context = makeMockExecutionContext(headers, { attemptId }, {});
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it("accepts valid signatures matching derived unlock key", async () => {
    const attemptId = "attempt-1";
    const timestamp = Date.now().toString();
    const nonce = "nonce-unique";
    const body = { attemptId, foo: "bar" };
    
    const unlockKey = `unlock-${attemptId}`;
    const message = `${timestamp}.${nonce}.${JSON.stringify(body)}`;
    const validSignature = cryptoKms.generateSignature(message, unlockKey);

    const headers = {
      "x-request-signature": validSignature,
      "x-request-nonce": nonce,
      "x-request-timestamp": timestamp,
      "x-device-fingerprint": "fingerprint-ok",
    };

    mockRedis.exists.mockResolvedValueOnce(0);
    mockRedis.set.mockResolvedValueOnce("OK");
    mockStateStore.getSession.mockResolvedValueOnce({
      attemptId,
      deviceFingerprintHash: "fingerprint-ok",
    });

    const context = makeMockExecutionContext(headers, body, {});
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});
