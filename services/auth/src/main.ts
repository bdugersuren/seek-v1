import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret || secret === "seek_jwt_secret_key_placeholder") {
      throw new Error(
        "CRITICAL: AUTH_JWT_SECRET is missing or using placeholder in production mode!",
      );
    }
  }

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const port = process.env.PORT || 3020;
  await app.listen(port);
  console.log(`auth service is running on: http://localhost:${port}`);
}
bootstrap();
