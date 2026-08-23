import { Injectable } from "@nestjs/common";
import type { SendOtpRequest, SendOtpResponse } from "@seek/contracts";

@Injectable()
export class SmsService {
  async sendOtp(dto: SendOtpRequest): Promise<SendOtpResponse> {
    if (!/^\d{6}$/.test(dto.code)) {
      return {
        success: false,
        message: "OTP кодын формат буруу байна.",
      };
    }

    const phoneSuffix = dto.phoneNumber.replace(/\D/g, "").slice(-4);
    console.log(`[SMS OTP MOCK] Delivery queued for phone ending ${phoneSuffix}.`);
    return {
      success: true,
      message: "OTP амжилттай илгээгдлээ.",
    };
  }
}
