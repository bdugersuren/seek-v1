import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// Handle BigInt JSON serialization
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3060;
  await app.listen(port);
  console.log(`assessment service is running on: http://localhost:${port}`);
}
bootstrap();
