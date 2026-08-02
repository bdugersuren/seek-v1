import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3170;
  await app.listen(port);
  console.log(`notification service is running on: http://localhost:${port}`);
}
bootstrap();
