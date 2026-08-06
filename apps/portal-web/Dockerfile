FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile

ARG NEXT_PUBLIC_API_URL=https://quiz-api.seek.mn/api
ARG NEXT_PUBLIC_ASSESSMENT_WEB_URL=https://quiz.seek.mn
ARG INTERNAL_API_URL=http://gateway:3010/api
ARG NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ASSESSMENT_WEB_URL=$NEXT_PUBLIC_ASSESSMENT_WEB_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL
ENV NEXT_PUBLIC_ENABLE_MOCK_AUTH=$NEXT_PUBLIC_ENABLE_MOCK_AUTH

RUN pnpm --filter @seek/contracts build
RUN pnpm --filter @seek/portal-web build
EXPOSE 8081
CMD ["pnpm", "--filter", "@seek/portal-web", "start"]
