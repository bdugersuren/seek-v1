import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ProxyMiddleware } from "./proxy.middleware";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProxyMiddleware).forRoutes("*");
  }
}
