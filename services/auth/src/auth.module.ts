import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "./prisma.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET || "seek_jwt_secret_key_placeholder",
      signOptions: {
        expiresIn: process.env.AUTH_ACCESS_TOKEN_TTL || "15m",
        issuer: process.env.AUTH_TOKEN_ISSUER || "seek.mn",
        audience: process.env.AUTH_TOKEN_AUDIENCE || "seek.mn",
      },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
