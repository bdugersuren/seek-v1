import { SetMetadata } from "@nestjs/common";
import type { SeekRole } from "@seek/contracts";

export const REQUIRED_ROLES_KEY = "required_roles";

export const Roles = (...roles: SeekRole[]) =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
