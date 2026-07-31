FROM node:18-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/gateway build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/services/gateway/dist /app/services/gateway/dist
EXPOSE 8080
WORKDIR /app/services/gateway
CMD ["node", "dist/src/main.js"]
