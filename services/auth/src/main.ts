import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { validateProductionAuthConfig } from "./security-config";

async function bootstrap() {
  validateProductionAuthConfig("auth service");

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const port = process.env.PORT || 3020;
  await app.listen(port);
  console.log(`auth service is running on: http://localhost:${port}`);
}
bootstrap();
