import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3070;
  await app.listen(port);
  console.log(`commerce service is running on: http://localhost:${port}`);
}
bootstrap();
