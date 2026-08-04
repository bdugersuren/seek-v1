import { Injectable } from "@nestjs/common";
import type { SendOtpRequest, SendOtpResponse } from "@seek/contracts";

@Injectable()
export class SmsService {
  async sendOtp(dto: SendOtpRequest): Promise<SendOtpResponse> {
    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SMS OTP MOCK] Утас: ${dto.phoneNumber}, Код: ${code}`);
    return {
      success: true,
      message: `OTP амжилттай илгээгдлээ. (Код: ${code})`,
    };
  }
}
