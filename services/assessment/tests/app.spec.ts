import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../src/app.controller";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("health checks", () => {
    it("should return health status", () => {
      const res = appController.getHealth();
      expect(res.status).toBe("OK");
      expect(res.service).toBe("assessment");
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
});
