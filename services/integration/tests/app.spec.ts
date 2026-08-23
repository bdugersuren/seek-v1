import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../src/app.controller";
import { KycService } from "../src/kyc.service";
import { SmsService } from "../src/sms.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [SmsService, KycService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("health checks", () => {
    it("should return health status", () => {
      const res = appController.getHealth();
      expect(res.status).toBe("OK");
      expect(res.service).toBe("integration");
    });

    it("should return live status", () => {
      const res = appController.getLive();
      expect(res.status).toBe("UP");
    });

    it("should return ready status", () => {
      const res = appController.getReady();
      expect(res.status).toBe("READY");
    });
  });

  describe("SMS OTP sandbox adapter", () => {
    it("accepts the Profile-generated six-digit code without returning it", async () => {
      const response = await appController.sendOtp({
        phoneNumber: "99112233",
        code: "654321",
      });

      expect(response).toEqual({
        success: true,
        message: "OTP амжилттай илгээгдлээ.",
      });
    });

    it("rejects an invalid OTP payload", async () => {
      await expect(
        appController.sendOtp({ phoneNumber: "99112233", code: "invalid" }),
      ).resolves.toEqual({
        success: false,
        message: "OTP кодын формат буруу байна.",
      });
    });
  });
});
