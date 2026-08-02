import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ReportingController } from "./reporting.controller";
import { ReportingService } from "./reporting.service";

@Module({
  imports: [],
  controllers: [AppController, ReportingController],
  providers: [ReportingService],
})
export class AppModule {}
