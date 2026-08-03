import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import type { SeekRole } from "@seek/contracts";
import { REQUIRED_ROLES_KEY } from "./decorators/roles.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.headers["x-user-id"];

    if (!userId) {
      throw new UnauthorizedException("Нэвтрэх эрхгүй байна.");
    }

    const requiredRoles =
      this.reflector.getAllAndOverride<SeekRole[]>(REQUIRED_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredRoles.length > 0) {
      const rolesHeader = request.headers["x-user-roles"];
      const userRoles =
        typeof rolesHeader === "string"
          ? rolesHeader.split(",").filter(Boolean)
          : [];
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );

      if (!hasRequiredRole) {
        throw new ForbiddenException("Энэ үйлдлийг хийх эрх хүрэлцэхгүй байна.");
      }
    }

    return true;
  }
}
