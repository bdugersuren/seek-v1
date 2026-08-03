import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { ProfileService } from "./profile.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, ProfileService],
})
export class AppModule {}
