FROM node:18-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/contracts build
RUN pnpm --filter @seek/organisation build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/organisation/package.json /app/services/organisation/package.json
COPY services/organisation/prisma /app/services/organisation/prisma
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages/contracts /app/packages/contracts
COPY --from=builder /app/services/organisation/dist /app/services/organisation/dist
EXPOSE 3040
ENV SERVICE_DIR=/app/services/organisation
WORKDIR /app/services/organisation
ENTRYPOINT ["service-entrypoint.sh"]
