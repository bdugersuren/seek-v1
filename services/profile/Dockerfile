FROM node:18-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/profile build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/profile/package.json /app/services/profile/package.json
COPY services/profile/prisma /app/services/profile/prisma
COPY --from=builder /app/services/profile/dist /app/services/profile/dist
EXPOSE 3030
ENV SERVICE_DIR=/app/services/profile
WORKDIR /app/services/profile
ENTRYPOINT ["service-entrypoint.sh"]
