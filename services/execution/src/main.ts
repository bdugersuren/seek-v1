import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function getCorsOrigins(): string[] {
  const configured = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN;
  if (configured) {
    return configured
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  return [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://portal.seek.mn",
    "http://quiz.seek.mn",
  ];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });
  const port = process.env.PORT || 3080;
  await app.listen(port);
  console.log(`execution service is running on: http://localhost:${port}`);
}
bootstrap();
