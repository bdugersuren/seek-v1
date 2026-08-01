import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ExecutionModule } from "./execution.module";

@Module({
  imports: [ExecutionModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
