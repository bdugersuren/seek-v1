#!/bin/bash
SERVICES=(
  "gateway 3010"
  "auth 3020"
  "profile 3030"
  "organisation 3040"
  "verification 3050"
  "competency 3060"
  "assessment 3070"
  "commerce 3080"
  "execution 3090"
  "evaluation 3100"
  "learning 3110"
  "ai 3120"
  "integration 3130"
  "file 3140"
  "reporting 3150"
  "platform 3160"
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
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/$name build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/packages/contracts/dist /app/packages/contracts/dist
COPY --from=builder /app/services/$name/dist /app/services/$name/dist
EXPOSE 8080
WORKDIR /app/services/$name
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
