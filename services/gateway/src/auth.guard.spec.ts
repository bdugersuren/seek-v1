import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  };
  let guard: AuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard(reflector as unknown as Reflector);
  });

  it("rejects requests without gateway identity", () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    expect(() => guard.canActivate(mockContext({}))).toThrow(
      UnauthorizedException,
    );
  });

  it("allows authenticated requests when no role is required", () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    expect(
      guard.canActivate(
        mockContext({
          "x-user-id": "user-1",
        }),
      ),
    ).toBe(true);
  });

  it("allows requests with a required role", () => {
    reflector.getAllAndOverride.mockReturnValue(["ASSESSOR"]);

    expect(
      guard.canActivate(
        mockContext({
          "x-user-id": "user-1",
          "x-user-roles": "CANDIDATE,ASSESSOR",
        }),
      ),
    ).toBe(true);
  });

  it("rejects requests without a required role", () => {
    reflector.getAllAndOverride.mockReturnValue(["SUPER_ADMIN"]);

    expect(() =>
      guard.canActivate(
        mockContext({
          "x-user-id": "user-1",
          "x-user-roles": "CANDIDATE",
        }),
      ),
    ).toThrow(ForbiddenException);
  });
});

function mockContext(headers: Record<string, string>) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as any;
}
