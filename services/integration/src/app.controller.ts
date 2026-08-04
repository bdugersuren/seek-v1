import { Body, Controller, Get, Post } from "@nestjs/common";
import { SmsService } from "./sms.service";
import { KycService } from "./kyc.service";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyIdentityRequest,
  VerifyIdentityResponse,
} from "@seek/contracts";

@Controller()
export class AppController {
  constructor(
    private readonly smsService: SmsService,
    private readonly kycService: KycService,
  ) {}

  @Get("health")
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "integration",
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

  @Post("integration/sms/send-otp")
  async sendOtp(@Body() dto: SendOtpRequest): Promise<SendOtpResponse> {
    return this.smsService.sendOtp(dto);
  }

  @Post("integration/kyc/verify-identity")
  async verifyIdentity(@Body() dto: VerifyIdentityRequest): Promise<VerifyIdentityResponse> {
    return this.kycService.verifyIdentity(dto);
  }
}
