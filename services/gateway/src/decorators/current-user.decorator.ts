import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const rolesHeader = request.headers["x-user-roles"];
    const roles =
      typeof rolesHeader === "string" ? rolesHeader.split(",").filter(Boolean) : [];

    return {
      id: request.headers["x-user-id"],
      sessionId: request.headers["x-session-id"],
      roles,
    };
  },
);
