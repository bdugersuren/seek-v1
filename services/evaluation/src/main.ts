import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3090;
  await app.listen(port);
  console.log(`evaluation service is running on: http://localhost:${port}`);
}
bootstrap();
