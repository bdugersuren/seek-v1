#!/bin/bash
SERVICES=(
  "gateway 3000"
  "auth 3010"
  "profile 3020"
  "organisation 3030"
  "verification 3040"
  "competency 3050"
  "assessment 3060"
  "commerce 3070"
  "execution 3080"
  "evaluation 3090"
  "learning 3100"
  "ai 3110"
  "integration 3120"
  "file 3130"
  "reporting 3140"
  "platform 3150"
)

for service_info in "${SERVICES[@]}"; do
  read -r name port <<< "$service_info"
  dir="services/$name"
  echo "Scaffolding service: $name on port $port"
  
  # Create directories
  mkdir -p "$dir/src" "$dir/tests" "$dir/migrations" "$dir/docs"
  
  # package.json
  cat <<EOT > "$dir/package.json"
{
  "name": "@seek/$name",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOT

  # tsconfig.json
  cat <<EOT > "$dir/tsconfig.json"
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "declaration": false,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
EOT

  # Dockerfile
  cat <<EOT > "$dir/Dockerfile"
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist
EXPOSE $port
CMD ["node", "dist/main.js"]
EOT

  # .env.example
  cat <<EOT > "$dir/.env.example"
PORT=$port
NODE_ENV=development
EOT

  # README.md
  cat <<EOT > "$dir/README.md"
# @seek/$name

$name microservice for the seek.mn platform.
EOT

  # Docs
  echo "# $name API" > "$dir/docs/API.md"
  echo "# $name Events" > "$dir/docs/EVENTS.md"
  echo "# $name Data Schema" > "$dir/docs/DATA.md"
  echo "# $name Runbook" > "$dir/docs/RUNBOOK.md"

  # src/app.controller.ts
  cat <<EOT > "$dir/src/app.controller.ts"
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: '$name'
    };
  }
}
EOT

  # src/app.module.ts
  cat <<EOT > "$dir/src/app.module.ts"
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
EOT

  # src/main.ts
  cat <<EOT > "$dir/src/main.ts"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || $port;
  await app.listen(port);
  console.log(\`$name service is running on: http://localhost:\${port}\`);
}
bootstrap();
EOT

  # tests placeholder
  echo "// $name unit tests placeholder" > "$dir/tests/app.spec.ts"
done
