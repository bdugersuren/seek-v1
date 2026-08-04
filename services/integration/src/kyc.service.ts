import { Injectable } from "@nestjs/common";
import type { VerifyIdentityRequest, VerifyIdentityResponse } from "@seek/contracts";

@Injectable()
export class KycService {
  async verifyIdentity(dto: VerifyIdentityRequest): Promise<VerifyIdentityResponse> {
    const registryNumber = dto.registryNumber || "";
    const fullName = dto.fullName || "";
    
    // Basic regex check for Mongolian Registry Number (e.g. УБ90051532)
    const regex = /^[А-ЯӨҮа-яөүЁё]{2}\d{8}$/;
    const isValid = regex.test(registryNumber.trim());

    if (!isValid) {
      return {
        verified: false,
        reason: "Регистрийн дугаарын формат буруу байна (жишээ нь: УБ90051532).",
      };
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      return {
        verified: false,
        reason: "Бүртгэлтэй овог нэр тохирохгүй байна.",
      };
    }

    // Mock verification succeeds for any valid registry format
    return {
      verified: true,
    };
  }
}
