import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { SmsService } from "./sms.service";
import { KycService } from "./kyc.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SmsService, KycService],
})
export class AppModule {}
