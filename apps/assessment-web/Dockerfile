FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile

ARG NEXT_PUBLIC_API_URL=https://quiz-api.seek.mn/api
ARG NEXT_PUBLIC_EXECUTION_URL=https://quiz-api.seek.mn/api/v1/execution
ARG NEXT_PUBLIC_MOCK_MODE=false
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_EXECUTION_URL=$NEXT_PUBLIC_EXECUTION_URL
ENV NEXT_PUBLIC_MOCK_MODE=$NEXT_PUBLIC_MOCK_MODE

RUN pnpm --filter @seek/contracts build
RUN pnpm --filter @seek/assessment-web build
EXPOSE 8082
CMD ["pnpm", "--filter", "@seek/assessment-web", "start"]
