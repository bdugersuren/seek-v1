import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3150;
  await app.listen(port);
  console.log(`platform service is running on: http://localhost:${port}`);
}
bootstrap();
