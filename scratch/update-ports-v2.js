const fs = require('fs');
const path = require('path');

const composePath = path.join(__dirname, '../docker-compose.yml');
let content = fs.readFileSync(composePath, 'utf8');

// 1. Update image and container names from seek-v1-* to seek-*
content = content.replace(/image:\s*seek-v1-([a-zA-Z0-9_-]+):latest/g, 'image: seek-$1:latest');
content = content.replace(/container_name:\s*seek-v1-([a-zA-Z0-9_-]+)/g, 'container_name: seek-$1');

// 2. Update frontend apps to use custom Dockerfiles
content = content.replace(
  /portal-web:[\s\S]*?image:\s*node:18-alpine/,
  `portal-web:
    profiles:
      - frontend
      - auth-test
    image: seek-portal-web:latest
    build:
      context: .
      dockerfile: apps/portal-web/Dockerfile`
);

content = content.replace(
  /assessment-web:[\s\S]*?image:\s*node:18-alpine/,
  `assessment-web:
    profiles:
      - frontend
      - assessment
    image: seek-assessment-web:latest
    build:
      context: .
      dockerfile: apps/assessment-web/Dockerfile`
);

// 3. Update portal-web ports and environments
content = content.replace(/ports:\r?\n\s*-\s*"127.0.0.1:3001:3000"/g, 'ports:\r\n      - "127.0.0.1:8081:8081"');
content = content.replace(/INTERNAL_API_URL=http:\/\/gateway:8080\/api/g, 'INTERNAL_API_URL=http://gateway:3010/api');
content = content.replace(/NEXT_PUBLIC_API_URL=http:\/\/localhost:3000\/api/g, 'NEXT_PUBLIC_API_URL=http://quiz-api.seek.mn/api');
content = content.replace(/http:\/\/localhost:3000/g, 'http://localhost:8081');

// 4. Update assessment-web ports and environments
content = content.replace(/ports:\r?\n\s*-\s*"127.0.0.1:3002:3000"/g, 'ports:\r\n      - "127.0.0.1:8082:8082"');

// 5. Update gateway configs
content = content.replace(/expose:\r?\n\s*-\s*"8080"\r?\n\s*ports:\r?\n\s*-\s*"127.0.0.1:3000:8080"/g, 
  `expose:
      - "3010"
    ports:
      - "127.0.0.1:3010:3010"`);

content = content.replace(/PORT:\s*8080\r?\n\s*NODE_ENV:\s*development\r?\n\s*AUTH_SERVICE_URL:\s*http:\/\/auth:8080\r?\n\s*EXECUTION_SERVICE_URL:\s*http:\/\/execution:8080/g,
  `PORT: 3010
      NODE_ENV: development
      AUTH_SERVICE_URL: http://auth:3020
      EXECUTION_SERVICE_URL: http://execution:3090`);

content = content.replace(/AUTH_ALLOWED_ORIGINS:[^\r\n]*/g,
  `AUTH_ALLOWED_ORIGINS: http://localhost:8081,http://localhost:8082,http://127.0.0.1:8081,http://127.0.0.1:8082,http://portal.seek.mn,http://quiz.seek.mn,http://quiz-api.seek.mn`);

content = content.replace(/http:\/\/localhost:8080\/health/g, 'http://localhost:3010/health');

// 6. Update NestJS business services expose, PORT and environment definitions
const services = {
  auth: 3020,
  profile: 3030,
  organisation: 3040,
  verification: 3050,
  competency: 3060,
  assessment: 3070,
  commerce: 3080,
  execution: 3090,
  evaluation: 3100,
  learning: 3110,
  ai: 3120,
  integration: 3130,
  file: 3140,
  reporting: 3150,
  platform: 3160
};

Object.entries(services).forEach(([name, port]) => {
  const exposeRegex = new RegExp(`container_name:\\s*seek-${name}\\r?\\n\\s*expose:\\r?\\n\\s*-\\s*"8080"\\r?\\n\\s*environment:\\r?\\n\\s*PORT:\\s*8080`, 'g');
  content = content.replace(exposeRegex, 
    `container_name: seek-${name}
    expose:
      - "${port}"
    environment:
      PORT: ${port}`);
});

fs.writeFileSync(composePath, content, 'utf8');
console.log('docker-compose.yml updated!');

// 7. Update docker-compose.dev.yml
const devPath = path.join(__dirname, '../docker-compose.dev.yml');
if (fs.existsSync(devPath)) {
  let devContent = fs.readFileSync(devPath, 'utf8');
  devContent = devContent.replace(/image:\s*seek-v1-([a-zA-Z0-9_-]+):latest/g, 'image: seek-$1:latest');
  devContent = devContent.replace(/container_name:\s*seek-v1-([a-zA-Z0-9_-]+)/g, 'container_name: seek-$1');
  devContent = devContent.replace(/INTERNAL_API_URL=http:\/\/gateway:8080\/api/g, 'INTERNAL_API_URL=http://gateway:3010/api');
  devContent = devContent.replace(/NEXT_PUBLIC_API_URL=http:\/\/localhost:3000\/api/g, 'NEXT_PUBLIC_API_URL=http://quiz-api.seek.mn/api');
  devContent = devContent.replace(/NEXT_PUBLIC_ASSESSMENT_WEB_URL=http:\/\/localhost:3901/g, 'NEXT_PUBLIC_ASSESSMENT_WEB_URL=http://localhost:8082');
  devContent = devContent.replace(/- "127\.0\.0\.1:3900:3000"/g, '- "127.0.0.1:8081:8081"');
  devContent = devContent.replace(/- "127\.0\.0\.1:3901:3001"/g, '- "127.0.0.1:8082:8082"');

  Object.entries(services).forEach(([name, port]) => {
    const devPortRegex = new RegExp(`container_name:\\s*seek-${name}\\r?\\n\\s*ports:\\r?\\n\\s*-\\s*"127\\.0\\.0\\.1:\\d+:(8080|3000)"`, 'g');
    devContent = devContent.replace(devPortRegex, 
      `container_name: seek-${name}
    ports:
      - "127.0.0.1:${port}:${port}"`);
  });

  fs.writeFileSync(devPath, devContent, 'utf8');
  console.log('docker-compose.dev.yml updated!');
}
