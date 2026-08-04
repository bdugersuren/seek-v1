import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MinioService } from "./minio.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MinioService],
})
export class AppModule {}
