import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.headers["x-user-id"];

    if (!userId) {
      throw new UnauthorizedException("Нэвтрэх эрхгүй байна.");
    }

    return true;
  }
}
