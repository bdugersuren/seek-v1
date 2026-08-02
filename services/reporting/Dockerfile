FROM node:18-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/reporting build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/reporting/package.json /app/services/reporting/package.json
COPY services/reporting/prisma /app/services/reporting/prisma
COPY --from=builder /app/services/reporting/dist /app/services/reporting/dist
EXPOSE 3150
ENV SERVICE_DIR=/app/services/reporting
WORKDIR /app/services/reporting
ENTRYPOINT ["service-entrypoint.sh"]
