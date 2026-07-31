import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("health")
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "execution",
    };
  }

  @Get("health/live")
  getLive() {
    return { status: "UP" };
  }

  @Get("health/ready")
  getReady() {
    return { status: "READY" };
  }
}
