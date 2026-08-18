import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { validateProductionAuthConfig } from "./security-config";

async function bootstrap() {
  validateProductionAuthConfig("gateway service");

  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors({
    origin: (
      process.env.AUTH_ALLOWED_ORIGINS ||
      "http://localhost:8081,http://localhost:8082,http://127.0.0.1:8081,http://127.0.0.1:8082,http://portal.seek.mn,http://quiz.seek.mn,http://quiz-api.seek.mn"
    ).split(","),
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Accept,Authorization,x-requested-with,x-user-id,x-session-id",
  });
  app.use(cookieParser());
  const port = process.env.PORT || 3010;
  await app.listen(port);
  console.log(`gateway service is running on: http://localhost:${port}`);
}
bootstrap();
